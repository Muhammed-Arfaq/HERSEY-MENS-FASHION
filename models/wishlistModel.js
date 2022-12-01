const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist