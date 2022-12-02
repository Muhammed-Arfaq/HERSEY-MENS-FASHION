const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponCode : {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    expiryDate: {
        type: Date,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    users: [mongoose.Schema.Types.ObjectId],
    date: {
        type: Date,
        default: Date.now()
    }
})

const Coupon = mongoose.model('Coupon', couponSchema)

module.exports = Coupon 