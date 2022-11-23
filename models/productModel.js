const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    size: {
        type:[String],
        required: true
    },
    category: {
        type: Objectid,
        required: true,
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: [String],
        required: true 
    },
    // delete: {
    //     type: String,
    //     default: 'listed'
    // }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
