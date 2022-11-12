const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    product: [{
        productId: {
            type: Objectid,
            ref: 'Product'
        },
        quantity: Number,
        Total: Number
    }]
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart