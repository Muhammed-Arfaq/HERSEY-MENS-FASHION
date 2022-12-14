const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const profileSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    gender: {
        type: String,
    },
    address: [{
        fullName: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        currentAddress: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now()
    }
})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile