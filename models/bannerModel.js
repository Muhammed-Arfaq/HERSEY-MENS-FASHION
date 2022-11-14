const mongoose = require('mongoose')
// const Objectid = mongoose.Types.ObjectId

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner