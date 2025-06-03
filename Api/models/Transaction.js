const mongoose = require('mongoose')
const { Schema} = mongoose;

const TransactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ['income', 'expense'], 
        default: 'expense',
        required: true 
    },
    datetime: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema)
module.exports = TransactionModel;