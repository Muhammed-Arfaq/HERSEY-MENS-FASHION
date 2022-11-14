const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    productId: {
        type: [Objectid],
        ref: 'Product'
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist