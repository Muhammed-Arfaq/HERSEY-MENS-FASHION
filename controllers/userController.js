const Product = require('./../models/productModel')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')


exports.userLogin = (req, res) => {
    res.render('user/sign-in')
}

exports.userRegister = (req, res) => {
    res.render('user/sign-up')
}

exports.userHome = (req, res) => {
    res.render('user/index')
}

exports.allProductsUser = catchAsync(async (req, res) => {
    const products = await Product.find()
    res.render('user/shop', { products })
})

exports.singleProduct = catchAsync(async (req, res) => {
    const prod = await Product.findById({ _id: req.params.id}).populate('category')
    res.render('user/productDetails', { prod })
})





