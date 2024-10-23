const mongoose = require('mongoose')
// const { Schema, model } = mongoose;
const TransactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price:{type:Number, required:true},
    description: { type:String, required: true } ,
    datetime: {type: String, required: true } ,
})

const TransactionModel = mongoose.model('Transaction', TransactionSchema)
module.exports = TransactionModel