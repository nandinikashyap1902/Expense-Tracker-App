const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// ─── POST /api/chat ──────────────────────────────────────────────────────────
const chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'AI service is not configured.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Fetch user + last 60 days of transactions in parallel
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const [user, transactions] = await Promise.all([
            User.findById(req.user.id).select('-password'),
            Transaction.find({
                author: req.user.id,
                datetime: { $gte: sixtyDaysAgo }
            }).sort({ datetime: -1 })
        ]);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const contextData = {
            monthlyIncome: user.income,
            currency: 'INR',
            transactions: transactions.map(t => ({
                date: t.datetime,
                amount: t.amount,
                type: t.type,
                category: t.category,
                description: t.description
            }))
        };

        const prompt = `
            You are a friendly Financial Analyst for a personal finance app.
            Provide realistic, data-driven insights in a concise format.

            User Data (last 60 days):
            ${JSON.stringify(contextData)}

            Current Date: ${new Date().toLocaleDateString('en-IN')}
            User Question: "${message}"

            Guidelines:
            1. Analyze trends: compare "This Month" vs "Last Month".
            2. Be specific with numbers (e.g., "You spent ₹2,400 more on Food").
            3. If you see a spike, suggest a specific actionable cutback.
            4. Keep responses concise and formatted with line breaks for readability.
            5. Use ₹ symbol for amounts.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ reply: text });
    } catch (err) {
        next(err);
    }
};

module.exports = { chat };
