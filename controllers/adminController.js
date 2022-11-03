const Product = require('./../models/productModel')
const Category = require('./../models/categoryModel')
// const Admin = require('./../models/adminModel')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')



// exports.addAdmin = catchAsync(async (req, res, next) => {
//     const admin = await Admin.find()

//     res.status(201).json({
//         status: 'success',
//         data: {
//             admin
//         }
//     })
// })

exports.loginPage = (req, res) =>{
    res.render('admin/sign-in')
}

exports.adminHome = (req, res) => {
    res.render('admin/dashboard')
}

// exports.manageUsers = (req, res) => {
//     res.render('admin/userManagement')
// }

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
    console.log(users);
    res.render('admin/userManagement',{users})
 
})


exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    })
    next()
})

exports.getCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find()

    res.status(200).json({
        status: 'success',
        data: {
            categories
        }
    })
    next()
})

// exports.updateProduct = catchAsync(async (req, res, next) => {
//     const products = await Product.findByIdAndUpdate()

//     res.status(200).json({
//         status: 'success',
//         data: {
//             products
//         }
//     })
//     next()
// })




