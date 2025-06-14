const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique:true},
    password: {type:String, required:true},
    income:{type:Number, required:true},
    role: {type: String, required: true, enum: ['user', 'admin'], default: 'user'}
})

const UserModel = new mongoose.model('User1', UserSchema)
module.exports = UserModel