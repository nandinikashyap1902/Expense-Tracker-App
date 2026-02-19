const express = require('express')
const app = express();
const cors = require('cors');
const Transaction = require('./models/Transaction.js')
const User = require('./models/User.js')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
dotenv.config()
// const mongoURL = "mongodb+srv://nandinikashyap:cmR4Xn6Rw9U6HcV0@cluster0.mxgfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoose = require("mongoose")
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const corsoptions = {
//     origin: 'http://localhost:5173',
//     credentials: true, 
// }
app.use(cors({
    origin: ['https://expense-tracker-app-alpha-ebon.vercel.app', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connected successfully'))
    .catch((err) => console.log(err))




// app.use(cors(corsoptions))
app.use(express.json())
app.get('/api/test', (req, res) => {
    res.json('test ok')
})


function authMiddleware(req, res, next) {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is invalid or expired.' });
    }
}
app.post('/api/transaction', async (req, res) => {
    try {
        const { token } = req.cookies;
        const { amount, type, datetime, category, description } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Validate required fields
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }
        if (!type || !['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Valid type (income/expense) is required' });
        }
        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Create new transaction
        const transaction = await Transaction.create({
            amount: parseFloat(amount),
            type,
            datetime: datetime || new Date().toISOString(),
            category,
            description: description || '',
            author: decoded.id
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Transaction creation error:', error);

        // Handle JWT errors
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/api/transactions', authMiddleware, async (req, res) => {

    const transactions = await Transaction.find({ author: req.user.id })
    res.json(transactions)
})

app.post('/api/signup', async (req, res) => {
    const { email, password, income } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists. Please use a different email or sign in.'
            });
        }

        const salt = bcrypt.genSaltSync(7);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const userDoc = await User.create({
            email,
            password: hashedPassword,
            income: Number(income)
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: userDoc._id,
                email: userDoc.email,
                income: userDoc.income
            }
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        // Handle other potential errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.errors
            });
        }
        res.status(500).json({
            message: 'An error occurred while creating your account. Please try again.'
        });
    }
});

app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body
    try {
        const userEmail = await User.findOne({ email })
        if (!userEmail) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const userPass = await bcrypt.compare(password, userEmail.password)
        if (!userPass) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        jwt.sign(
            { email, id: userEmail._id }, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ message: 'Authentication failed. Please try again.' });
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // true in production
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'

                })

                    .json({ id: userEmail._id, userEmail })
            })
    }

    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
    // res.json()
})


app.get('/api/profile', async (req, res) => {
    const { token } = req.cookies;
    //console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired' })
        }

        try {
            const user = await User.findById(info.id);
            res.json({ income: user.income, email: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch income.' });
        }
    })
})

app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { income } = req.body;

        if (income === undefined || isNaN(income)) {
            return res.status(400).json({ error: 'Valid income amount is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { income: Number(income) },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ income: user.income, email: user.email });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});


app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {

        httpOnly: true,  // JavaScript can't access the cookie
        secure: false,

    });
    res.status(200).json({ message: 'Logged out successfully' });
})

app.delete('/api/transaction/:id', authMiddleware, async (req, res) => {
    try {


        const { id } = req.params;
        const transactionDoc = await Transaction.findById(id)
        if (!transactionDoc) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (transactionDoc.author.toString() !== req.user.id) {
            console.log(typeof req.user.id)
            return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this post.' });
        }
        await Transaction.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }

})

app.put('/api/transaction', async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
        const { amount, type, datetime, category, description, id } = req.body;

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check ownership
        if (transaction.author.toString() !== decoded.id) {
            return res.status(403).json({ error: 'You are not the author of this transaction' });
        }

        // Update fields
        transaction.amount = parseFloat(amount);
        transaction.type = type;
        transaction.datetime = datetime;
        transaction.category = category;
        transaction.description = description;

        await transaction.save();
        res.json(transaction);

    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
})
app.get('/api/transaction/:id', async (req, res) => {
    const { id } = req.params

    const transaction = await Transaction.findById(id)
    res.json(transaction)
})

app.post('/api/chat', authMiddleware, async (req, res) => {
    try {
        console.log("Chat request received");
        const { message } = req.body;
        console.log("Message:", message);

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log("Checking API Key...");
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("YOUR_FREE")) {
            console.error("Invalid API Key");
            return res.status(500).json({ error: "API Key is missing or default." });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("Fetching User Data...");
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User profile not found." });
        }

        console.log("Fetching Transactions...");

        // 2. Fetch Transactions for the last 60 days (Current + Previous Month High Fidelity Data)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const transactions = await Transaction.find({
            author: req.user.id,
            datetime: { $gte: sixtyDaysAgo.toISOString() }
        }).sort({ datetime: -1 });

        // Prepare context data string
        const contextData = {
            monthlyIncome: user.income,
            currency: "INR",
            transactions: transactions.map(t => ({
                date: t.datetime,
                amount: t.amount,
                type: t.type,
                category: t.category,
                description: t.description
            }))
        };

        const prompt = `
            You are a Business Intelligence Financial Analyst for a personal finance app.
            Your goal is to provide realistic, data-driven insights.

            User Data (last 60 days):
            ${JSON.stringify(contextData)}
            
            Current Date: ${new Date().toLocaleDateString()}
            User Question: "${message}"

            **CRITICAL GUIDELINES:**
            1. **Analyze Trends**: processing the data, compare "This Month" vs "Last Month" (based on transaction dates).
            2. **Be Specific**: precise numbers are better than generalities. (e.g., "You spent ₹2,400 more on Food").
            3. **Actionable Tips**: If you see a spike (e.g., high dining costs), suggest a specific cutback amount relative to their income.
            
            **Expected Output Style for "Summary" requests:**
            "You spent [X]% [more/less] on [Category] this month compared to last month. 
            Your biggest expense was [Category] (₹[Amount]). Consider [Actionable Tip] to save ₹[SavedAmount] next month."

            If the user asks a simple question (e.g. "Total spent on food"), just answer simply.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ error: "Failed to generate response. Ensure GEMINI_API_KEY is set." });
    }
})
app.listen(5000, () => {
    console.log('i am running')
})