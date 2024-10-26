const express = require('express')
const app = express();
const cors = require('cors');
const Transaction = require('./models/Transaction.js')
 const User = require('./models/User.js')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config()
// const mongoURL = "mongodb+srv://nandinikashyap:cmR4Xn6Rw9U6HcV0@cluster0.mxgfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoose = require("mongoose")
app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    res.json('test ok')
})

app.post('/api/transaction', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { price,name, description, datetime } = req.body
    const transaction = await Transaction.create({ price,name, description, datetime })
    res.json(transaction)
})

app.get('/api/transactions', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions)
})

app.post('/api/signup', (req,res) => {
    const { email, password } = req.body
    mongoose.connect(process.env.MONGO_URL);

})
app.listen(5000, () => {
    console.log('i am running')
})