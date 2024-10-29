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
const corsoptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
}
app.use(cors(corsoptions))
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
app.post('/api/transaction',async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token }  = req.cookies
    const {  income,
        expense,
        datetime,
        category,
        description } = req.body
    jwt.verify(token, process.env.SECRET_KEY, async (err, info) => {
        if (err) throw err;
        // console.log(info)
        const transaction = await Transaction.create({
            income,
            expense,
            datetime,
            category,
            description,
            author:info.id
        })
        res.json(transaction)
    })
    
   
})

app.get('/api/transactions', authMiddleware,async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find({ author: req.user.id }) 
    res.json(transactions)
})

app.post('/api/signup', (req,res) => {
    const { email, password } = req.body
    try {
        mongoose.connect(process.env.MONGO_URL);
        
        const salt = bcrypt.genSaltSync(7);
        const hashedpassword = bcrypt.hashSync(password, salt)
        const userDoc = User.create({
            email,
            password:hashedpassword
        })
        res.json(userDoc)
    }
    catch(err){
        res.status.json(err)
    }
})

app.post('/api/signin', async (req, res) => {
  
    const { email, password } = req.body
    try {
        mongoose.connect(process.env.MONGO_URL);
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
                    secure: false,
                    
                })
       
            .json({ id: userEmail._id, userEmail }) }) 
    }
    
        catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
})


app.get('/api/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
  jwt.verify(token, process.env.SECRET_KEY, (err,info) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired' })
        }
        
        res.json(info);
    })
}) 

app.post('/api/logout', (req, res) => {
    res.clearCookie('token' ,{
      
        httpOnly: true,  // JavaScript can't access the cookie
        secure: false,
       
    });
    res.status(200).json({ message: 'Logged out successfully' });
})

app.delete('/api/transaction/:id', authMiddleware,async (req, res) => {
    try {
        const { id } = req.params;
        const transactionDoc = await Transaction.findById(id)
        if (!transactionDoc) {
            return res.status(404).json({ message: 'Post not found.' });
        }
      return  res.json(transactionDoc)
    }catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }

})
app.listen(5000, () => {
    console.log('i am running')
})