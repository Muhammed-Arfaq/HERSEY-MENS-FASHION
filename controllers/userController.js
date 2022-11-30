const Product = require('./../models/productModel')
const User = require('./../models/userModel')
const Cart = require('./../models/cartModel')
const Banner = require('./../models/bannerModel')
const Wishlist = require('../models/wishlistModel')
const Profile = require('../models/profileModel')
const Order = require('./../models/orderModel')
const Avatar = require('./../models/avatarModel')
const catchAsync = require('./../utils/catchAsync')
const mongoose = require('mongoose')
const Category = require('../models/categoryModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')

exports.pageNotFound = (req, res) => {
    res.render('pageNotFound')
}

exports.userLogin = (req, res) => {
    res.render('user/sign-in')
}

exports.userRegister = (req, res) => {
    res.render('user/sign-up')
}

exports.userHome = catchAsync(async(req, res, next) => {
    const banners = await Banner.find()
    const products = await Product.find().limit(6)
    const token = req.cookies.jwt
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const user = await User.findById(userId)
        if(user != null) {
            let userEmail = user.email
            res.render('user/index', { token, userEmail, banners, products })
        } else {
            res.render('user/index', { token: null, banners, products })
        }
        
    }
    else {
        res.render('user/index', { token: null, banners, products })
    }
})

exports.userLogout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

exports.addAddress = catchAsync(async(req, res) => {
    let userId = req.user
    const profile = await Profile.findOne({ userId })
    const user = await User.findById( userId )   
    if(profile != null) {
        let profiles = profile.address
        res.render('user/addAddress', { profiles, user, profile })
    }
    else{
        res.render('user/addAddress', { user, profile })
    }    
})

exports.userProfile = catchAsync(async(req, res) => {
    let userId = req.user._id
    let sort = { date: -1 }
    const profile = await Profile.findOne({ userId })
    const order = await Order.find({ userId }).populate('product.productId').sort(sort)
    const user = await User.findById( userId )
    const avatar = await Avatar.findOne({ userId })
    if(profile != null ){
        let num = profile.address.length - 1
        let profiles = profile.address[num]
        res.render('user/userProfile', { user, profiles, moment, profile, order, avatar, index: 1 })
    }
    else{ 
        res.render('user/userProfile', { user, profile, order, avatar, index: 1 })
    }    
})

exports.updateAddress = catchAsync(async (req, res, next) => {
    let userId = req.user._id
    let addIndex = req.params.id
    const profile = await Profile.findOne({ userId })
    const addressId = profile.address[addIndex]._id
    const user = await User.findById( userId )
    let profiles = profile.address
    console.log(profiles);
    res.render('user/updateAddress', { profiles, user, addIndex, addressId }) 
})

exports.updateUserAddress = catchAsync(async(req, res, next) => {
    let userId = req.user._id
    const addressId = req.params.id
    let { fullName, pincode, country, currentAddress, city, state } = req.body
    await Profile.updateMany({ userId, 'address._id': addressId }, { $set: { 
    'address.$.fullName': fullName, 
    'address.$.pincode': pincode,
    'address.$.country': country,
    'address.$.currentAddress': currentAddress,
    'address.$.city': city,
    'address.$.state': state
    }})
    res.redirect('/address')
})

exports.changeAddress = catchAsync(async(req, res, next) => {
    const addressId = req.params.id
    const currentAdd = await Profile.findOne({ 'address._id': addressId })
    console.log(currentAdd);
    res.render('user/checkout', { currentAdd })
})

exports.userSettings = catchAsync(async(req, res, next) => {

    const userId = req.user._id
    const user = await User.findById( userId )

    res.render('user/settings',{ user })
})

exports.deleteAddress = catchAsync(async(req, res, next) => {
    const userId = req.user._id
    const addressId = req.params.id
    console.log(addressId);
    await Profile.updateOne({ userId }, { $pull: {address: {_id: addressId }}})
    res.redirect('/address')
})

exports.allProductsUser = catchAsync(async (req, res) => {
    const products = await Product.find()
    const category = await Category.find()
    const token = req.cookies.jwt
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const user = await User.findById(userId)
        if(user != null) {
            res.render('user/shop', { token, products, category })
        } else {
            res.render('user/shop', { token: null, products, category })
        }
    }
    else {
        res.render('user/shop', { token: null, products, category })
    }
    
})

exports.singleProduct = catchAsync(async (req, res) => {
    const prod = await Product.findById({ _id: req.params.id}).populate('category')
    const relatedProduct = await Product.find({category: prod.category})
    const token = req.cookies.jwt
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const user = await User.findById(userId)
        if(user != null) {
            res.render('user/productDetails', { token, prod, relatedProduct })
        } else {
            res.render('user/productDetails', { token: null, prod, relatedProduct })
        }
    }
    else {
        res.render('user/productDetails', { token: null, prod, relatedProduct })
    }
})

exports.findCart = catchAsync(async(req, res, next) => {
    const userId = req.user  
    const cart = await Cart.findOne({ userId }).populate('product.productId')
    if(cart != null) {
        const carts = cart.product
        const cartTotal = cart.cartTotal
        res.render('user/shoppingCart', { carts, cart, cartTotal })
    }
    else {
        res.render('user/shoppingCart', { carts: [], cart: null, cartTotal: null })
    }
})

exports.deleteCartProducts = catchAsync(async(req, res, next) => {
    const userId = req.user
    const productId = req.params.id   
    const price = req.params.price
    const quantity = req.params.quantity
    const amt = price * quantity
    await Cart.findOneAndUpdate({ userId }, { $pull: { product: { productId: productId }}, $inc: { cartTotal: -amt } })     
    res.redirect('/shoppingCart')
})

exports.incQuantity = catchAsync(async(req, res, next) => {
    const userId = req.user._id
    const productId =  req.params.id
    const price = req.params.price
    await Cart.findOneAndUpdate({ userId, 'product._id': productId }, { $inc: { 'product.$.quantity': 1, 'product.$.total': price, cartTotal: price } })
    res.redirect('/shoppingCart')
})

exports.decQuantity = catchAsync(async(req, res, next) => {
    const userId = req.user._id
    const productId =  req.params.id
    const price = req.params.price
    await Cart.findOneAndUpdate({ userId, 'product._id': productId }, { $inc: { 'product.$.quantity': -1, 'product.$.total': -price, cartTotal: -price } })
    res.redirect('/shoppingCart')

})

exports.productWishlist = catchAsync( async(req, res, next) => {
    let userId = req.user
    const wishlist = await Wishlist.findOne({ userId }).populate('productId')
    if(wishlist != null) {
        let list = wishlist.productId
        res.render('user/wishlist', { list, wishlist })
    } else {
        res.render('user/wishlist', { list: [], wishlist: null })
    }
})

exports.deleteWishListProduct = catchAsync(async(req, res, next) => {
    let userId = req.user
    let productId = req.params.id
    await Wishlist.findOneAndUpdate({ userId }, { $pull: { productId: productId }})
    
    res.redirect('back')
})

exports.checkout = catchAsync(async(req, res, next) => {
    let userId = req.user._id
    let profile = await Profile.findOne({ userId })
    const user = await User.findById( userId )
    const cart = await Cart.findOne({ userId }).populate('product.productId')
    const carts = cart.product
    const cartTotal = cart.cartTotal
    if(profile != null ){
        profile = profile.address
        let num = profile.length -1
        const addIndex = req.body.indexs? req.body.indexs: num
        console.log(req.body);
        res.render('user/checkout', { user, addIndex, profile, carts, cart, cartTotal, index:1 })

    }
    else{ 
        res.render('user/checkout', { user, profile })
    }    
    
})

exports.orderPage = catchAsync(async(req, res) => {
    let sort = { date: -1 }
    const userId = req.user
    const order = await Order.find({ userId }).populate('product.productId').sort(sort)
    const user = userId.phone  
    res.render('user/orderPage', { order, user, moment, index: 1 })
})

exports.orderSuccess = catchAsync(async(req, res, next) => {
    const userId = req.user
    const orders = await Order.find({ userId }).populate('product.productId').sort({ _id: -1 }).limit(1)
    
    res.render('user/orderSuccess', { orders, index: 1 })
})

exports.cancelOrder = catchAsync(async(req, res, next) => {
    const userId = req.user
    const productId = req.params.id
    console.log(productId);
    await Order.findOneAndUpdate({ userId, 'product._id': productId }, { $set: { 'product.$.orderStatus': 'Cancelled' }   })
    res.redirect('back')
})







