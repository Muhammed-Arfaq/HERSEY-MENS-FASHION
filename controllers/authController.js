const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const Product = require('./../models/productModel')
const Category = require('./../models/categoryModel')
const Cart = require('./../models/cartModel')
const mongoose = require('mongoose')



const sendEmail = require('./../utils/email')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOPtions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        cookieOPtions.secure = true
    }
    res.cookie('jwt', token, cookieOPtions)

    //remove the password from the output
    user.password = undefined
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
    if (!email || !password) {
        return next(new AppError('please provide email and password!!!', 400))
    }

    //to check if admin exists and password is correct
    const admin = await Admin.findOne({ email }).select('+password')

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    //if everything is correct, send token to client
    createSendToken(admin, 201, res)

    res.redirect('/admin/dashboard')
    next()
})

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    createSendToken(newUser, 201, res)
    next()
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError('please provide email and password!!!', 400))
    }

    //to check if user exists and password is correct
    const user = await User.findOne({ $and: [{ email }, { status: 'Active' }] }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    //if everything is correct, send token to client
    createSendToken(user, 201, res)
    res.redirect('/')
    next()
})

exports.addCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({
        name: req.body.name,
    })

    createSendToken(newCategory, 201, res)
    res.redirect('/admin/category')
})

exports.addProducts = catchAsync(async (req, res, next) => {
    const image = req.file
    const newProduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price,
        quantity: req.body.quantity,
        imageUrl: image.filename
    })

    createSendToken(newProduct, 201, res)
    res.redirect('/admin/dashboard/manageProducts')
    next()
})

exports.addToCart = catchAsync(async(req, res, next) => {
    console.log(req.user);
    let userId = req.user
    let productId = req.params.id
    let quantity = req.body.quantity
    let cart = await Cart.findOne({ userId })
    if(cart) {
        await Cart.findOneAndUpdate({ userId }, { $push: { product: { productId, quantity } } })        
    }else {
        const addCart = await Cart.create({
            userId: mongoose.Types.ObjectId(req.user._id),
            product: [{ productId, quantity }]
        })
        createSendToken(addCart, 201, res)        
    }
    res.redirect('/shop')
    next()
})

exports.addToWishlist = catchAsync(async(req, res, next) => {
    
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
});

exports.restrictTo = (Admin) => {
    return (req, res, next) => {
        if (!Admin.includes(req.user.Admin)) {
            return next(new AppError('you do not have permission'))
        }
        next()
    }
}

// exports.forgotPassword = catchAsync(async(req, res, next) => {
//     //get user based on posted email
//     const user = await User.findOne({ email: req.body.email })
//     if(!user) {
//         return next(new AppError('there is no user with this email address'))
//     }

//     //generate the random token
//     const resetToken = user.createPasswordResetToken()
//     await user.save({ validateBeforeSave: false })

//     //send it to user's email
//     const resetURL = '${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}'
//     const message = 'forgot your password? Submit a new request with your new password and passwordConfirm to: $(resetURL).\n if you didnt forget your password then please ignore this email.'

//     try{
//         await sendEmail({
//             email: user.email,
//             subject: 'your password reset token(valid for 10 min)',
//             message
//         })
//     }catch(err) {
//         user.passwordResetToken = undefined
//         user.passwordResetExpires = undefined
//         await user.save({ validateBeforeSave: false })

//         return next(new AppError('there was an error sending the email. Try again later'))
//     }
// })

// exports.resetPassword = (req, res, next) => {}

