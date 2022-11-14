const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const profileSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    gender: {
        type: String,
        required: true
    },
    address: [{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
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
        State: {
            type: String,
            required: true
        }
    }],
    profileImage : {
        type: String,
        required: true
    }
})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile