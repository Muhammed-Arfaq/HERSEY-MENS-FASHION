const Product = require('./../models/productModel')
const User = require('./../models/userModel')
const Cart = require('./../models/cartModel')
const catchAsync = require('./../utils/catchAsync')
const Wishlist = require('../models/wishlistModel')
const Profile = require('../models/profileModel')
const mongoose = require('mongoose')


exports.userLogin = (req, res) => {
    res.render('user/sign-in')
}

exports.userRegister = (req, res) => {
    res.render('user/sign-up')
}

exports.userHome = (req, res) => {
    res.render('user/index')
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
    const profile = await Profile.findOne({ userId })
    const user = await User.findById( userId )
    if(profile != null ){
        let num = profile.address.length - 1
        let profiles = profile.address[num]
        res.render('user/userProfile', { user, profiles, profile })

    }
    else{ 
        res.render('user/userProfile', { user, profile })
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
    let { fullName, pincode, currentAddress, city, state } = req.body
    await Profile.updateMany({ userId, 'address._id': addressId }, { $set: { 
    'address.$.fullName': fullName, 
    'address.$.pincode': pincode,
    'address.$.currentAddress': currentAddress,
    'address.$.city': city,
    'address.$.state': state
    }})
    res.redirect('/address')
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
    res.render('user/shop', { products })
})

exports.singleProduct = catchAsync(async (req, res) => {
    const prod = await Product.findById({ _id: req.params.id}).populate('category')
    const relatedProduct = await Product.find({category: prod.category})
    res.render('user/productDetails', { prod, relatedProduct })
})

exports.findCart = catchAsync(async(req, res, next) => {
    const userId = req.user  
    const cart = await Cart.findOne({ userId }).populate('product.productId')
    const carts = cart.product
    res.render('user/shoppingCart', { carts })
})

exports.deleteCartProducts = catchAsync(async(req, res, next) => {
    const userId = req.user
    const productId = req.params.id
    await Cart.findOneAndUpdate({ userId }, { $pull: { product: { productId: productId } } })     
    res.redirect('/shoppingCart')
})

exports.incQuantity = catchAsync(async(req, res, next) => {
    const userId = req.user._id
    const productId =  req.params.id
    await Cart.findOneAndUpdate({ userId, 'product._id': productId }, { $inc: { 'product.$.quantity': 1 } })
    res.redirect('/shoppingCart')
})

exports.decQuantity = catchAsync(async(req, res, next) => {
    const userId = req.user._id
    const productId =  req.params.id
    await Cart.findOneAndUpdate({ userId, 'product._id': productId }, { $inc: { 'product.$.quantity': -1 } })
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

exports.checkout = (req, res) => {
    res.render('user/checkout')
}








