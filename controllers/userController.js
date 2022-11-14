const Product = require('./../models/productModel')
const User = require('./../models/userModel')
const Cart = require('./../models/cartModel')
const catchAsync = require('./../utils/catchAsync')
const Wishlist = require('../models/wishlistModel')
const Profile = require('../models/profileModel')


exports.userLogin = (req, res) => {
    res.render('user/sign-in')
}

exports.userRegister = (req, res) => {
    res.render('user/sign-up')
}

exports.userHome = (req, res) => {
    res.render('user/index')
}

exports.userProfile = catchAsync(async(req, res) => {
    let userId = req.user
    const user = await Profile.findOne({ userId })
    const address = await User.findOne({ userId })
    res.render('user/userProfile', { user, address })
})

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
    let carts = cart.product
    res.render('user/shoppingCart', { carts })
})

exports.deleteCartProducts = catchAsync(async(req, res, next) => {
    let userId = req.user
    let productId = req.params.id
    await Cart.findOneAndUpdate({ userId }, { $pull: { product: { productId: productId } } })     
    res.redirect('/shoppingCart')
})

exports.productWishlist = catchAsync( async(req, res, next) => {
    let userId = req.user
    const wishlist = await Wishlist.findOne({ userId }).populate('productId')
    let list = wishlist.productId
    res.render('user/wishlist', { list })
})

exports.deleteWishListProduct = catchAsync(async(req, res, next) => {
    let userId = req.user
    let productId = req.params.id
    await Wishlist.findOneAndUpdate({ userId }, { $pull: { productId: productId }})
    
    res.redirect('/wishlist')
})

exports.addProfile = catchAsync(async(req, res, next) => {
    
})






