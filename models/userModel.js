const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
    },
    status: {
        type: String,
        default: 'Active'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date

})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimestamp
    }

    //false means not changed
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User

