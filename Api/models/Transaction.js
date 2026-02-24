const mongoose = require('mongoose')
const { Schema } = mongoose;

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be a positive number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        default: 'expense',
        required: true
    },
    datetime: {
        type: Date,       // ✅ Fixed: was String — broke date comparisons & sorting
        required: true,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true       // ✅ Added index — speeds up all user-specific queries
    }
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = TransactionModel;
