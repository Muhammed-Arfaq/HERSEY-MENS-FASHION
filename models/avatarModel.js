const mongoose = require('mongoose')

const avatarSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Avatar = mongoose.model('Avatar', avatarSchema)

module.exports = Avatar

