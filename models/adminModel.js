const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'enter your name']
    },
    email: {
        type: String,
        required: [true, 'enter your email id'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,  'please enter a valid email']
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: [true, 'provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password 
            },
            message: 'Password are not the same'
        }
    }
})

// adminSchema.pre('save', async function(next){
//     if(!this.isModified('password')) return next()
//     this.password = await bcrypt.hash(this.password, 12)
//     this.passwordConfirm = undefined
//     next()
// })

adminSchema.methods.correctPassword = async function(candidatePassword, adminPassword) {
    return await bcrypt.compare(candidatePassword, adminPassword)
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin