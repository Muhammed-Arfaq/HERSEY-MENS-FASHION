const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        total: Number
    }],
    cartTotal: {
        type: Number,
    },
    grandTotal: {
        type: Number
    },
    discount: {
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart