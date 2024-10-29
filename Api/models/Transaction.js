const mongoose = require('mongoose')
 const { Schema} = mongoose;
const TransactionSchema = new mongoose.Schema({
    income: { type: Number },
    expense:{type:Number, },
    datetime: { type: String},
    category:{type: String,},
    description: { type: String, },
    author:{type:Schema.Types.ObjectId,ref:'User'}
})

const TransactionModel = mongoose.model('Transaction', TransactionSchema)
module.exports = TransactionModel