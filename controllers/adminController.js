const Product = require('./../models/productModel')
const Category = require('./../models/categoryModel')
const Admin = require('./../models/adminModel')
const User = require('./../models/userModel')
const Avatar = require('./../models/avatarModel')
const Order = require('./../models/orderModel')
const catchAsync = require('./../utils/catchAsync')
const Banner = require('../models/bannerModel')
const { populate } = require('./../models/productModel')
const moment = require('moment')

// exports.addAdmin = catchAsync(async (req, res, next) => {
//     const admin = await Admin.find()
//     res.render('admin/signup')
// })

exports.loginPage = (req, res) => {
    res.render('admin/sign-in')
}

exports.adminLogout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/admin/login')
}

exports.adminHome = async(req, res) => {
    const adminId = req.admin._id
    const admin = await Admin.findOne(adminId)
    console.log(admin);
    res.render('admin/dashboard', { admin })
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const items_per_page = 10;
    const totalUser = await User.find().countDocuments()
    console.log(totalUser);
    const users = await User.find().sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
    const avatar = await Avatar.find()
    const img = avatar[0].image
    console.log(img);
    res.render('admin/userManagement', { users, img, page,
        hasNextPage: items_per_page * page < totalUser,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1, })

})

exports.blockUser = async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: "Blocked" } })
    res.redirect('/admin/dashboard/manageUsers')
}

exports.unBlockUser = async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: "Active" } })
    res.redirect('/admin/dashboard/manageUsers')
}

exports.addProduct = catchAsync(async (req, res, next) => {

    const categories = await Category.find()
    //to get categories in ejs files without passing them from here.
    res.locals.categories = categories || null;

    res.render('admin/addProduct')
    next()
})

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/admin/dashboard/manageProducts')
}

//edit page render
exports.editProductRender = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    const categories = await Category.find({ _id: { $ne: product.category } })
    res.render('admin/editProduct', { product, categories })
})

//to edit product
exports.editProduct = catchAsync(async (req, res, next) => {
    if (req.file) {
        let image = req.file
        await Product.findByIdAndUpdate({ _id: req.params.id }, { $set: { imageUrl: image.filename } })
    }
    console.log(req.file);
    await Product.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
    res.redirect('/admin/dashboard/manageProducts')
})

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().populate('category')
    console.log(products);
    res.render('admin/productManagement', { products })
    next()
})

exports.getBanner = catchAsync(async (req, res, next) => {
    const banner = await Banner.find()
    res.render('admin/bannerManagement', { banner })
    next()
})

exports.deleteBanner = catchAsync(async (req, res, next) => {
    const banner = await Banner.find()
    await Banner.findByIdAndDelete({ _id: req.params.id })
    res.render('admin/bannerManagement', { banner })

})

exports.getCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find()

    res.render('admin/categoryManagement', { categories, index: 1 })
    next()
})

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/admin/dashboard/addCategories')
}

exports.allOrders = catchAsync(async (req, res, next) => {

    const orders = await Order.find().populate('product.productId')
    console.log(orders);
    res.render('admin/allOrders', { orders, moment })
})

exports.manageOrder = catchAsync(async (req, res, next) => {

    const orderId = req.params.id
    const orders = await Order.findOne({ _id: orderId }).populate('product.productId')
    const days = parseInt((orders.deliveryDate.getTime() - orders.date.getTime()) / (1000 * 60 * 60 * 24))
    res.render('admin/orderManagement', { orders, days, moment })
})

exports.invoice = catchAsync(async (req, res, next) => {

    const orderId = req.params.id
    const orders = await Order.findOne({ _id: orderId }).populate('product.productId')
    const userId = orders.userId
    const user = await User.findOne({ _id: userId })
    console.log(user);
    res.render('admin/invoice', { orders, user, orderId, index: 1, moment })
})



