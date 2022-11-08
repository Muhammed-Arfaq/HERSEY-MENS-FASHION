const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const Product = require('./../models/productModel')
const Category = require('./../models/categoryModel')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


// exports.signup = catchAsync(async (req, res, next) => {
//     const newAdmin = await Admin.create({
//         name : req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm
//     })

//     const token = signToken(newAdmin._id)
    
//     res.status(201).json({
//         status: 'success',
//         token,
//         data: {
//             user: newAdmin
//         }
//     })
//     next()
// })

exports.adminLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //to check email and password exist
    if(!email || !password){
        return next(new AppError('please provide email and password!!!', 400))
    }

    //to check if admin exists and password is correct
    const admin = await Admin.findOne({ email }).select('+password')

    if(!admin || !(await admin.correctPassword(password, admin.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    //if everything is correct, send token to client
    const token = signToken(admin._id)

    res.redirect('/admin/dashboard')

    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
    next()
})  

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name : req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(newUser._id)
    next()
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //to check email and password exist
    if(!email || !password){
        return next(new AppError('please provide email and password!!!', 400))
    }

    //to check if user exists and password is correct
    const user = await User.findOne({ $and: [{ email }, { status: 'Active' }] }).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    //if everything is correct, send token to client
    const token = signToken(user._id)

    res.redirect('/')
    next()
})  

exports.addCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({
        name : req.body.name,
    })
    const token = signToken(newCategory._id)
    res.redirect('/admin/category')
})

exports.addProducts = catchAsync(async (req, res, next) => {
    const image = req.file
    const newProduct = await Product.create({
        name : req.body.name,
        description : req.body.description,
        category : req.body.category,
        price : req.body.price,
        quantity : req.body.quantity,
        imageUrl : image.filename
    })
    
    const token = signToken(newProduct._id)
    res.redirect('/admin/dashboard/manageProducts')
    next()
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1]
    }
    console.log(token)

    if(!token){
        return next(
            new AppError('you are not logged in! Please login to get access', 401)
        )
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
})
