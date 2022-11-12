const Product = require('./../models/productModel')
const User = require('./../models/userModel')
const Cart = require('./../models/cartModel')
const catchAsync = require('./../utils/catchAsync')
const { addToCart } = require('./authController')


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
    const relatedProduct = await Product.find({category: prod.category})
    res.render('user/productDetails', { prod, relatedProduct })
})

exports.findCart = catchAsync(async(req, res, next) => {
    let userId = req.user  
    const cart = await Cart.findOne({ userId }).populate('product.productId')
    console.log(cart.product[0])
    let carts = cart.product
    res.render('user/shoppingCart', { carts })
})

exports.wishlist = catchAsync( async(req, res, next) => {
    
})






