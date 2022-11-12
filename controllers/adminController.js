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
    // console.log(users);
    res.render('admin/userManagement', { users })
 
})

exports.blockUser = async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: "Blocked" }})
    res.redirect('/admin/dashboard/manageUsers')
}

exports.unBlockUser = async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: "Active" }})
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
    const product = await Product.findById( req.params.id ).populate('category')
    const categories = await Category.find({ _id: { $ne: product.category}})
    res.render('admin/editProduct',{ product, categories })
})

//to edit product
exports.editProduct = catchAsync(async(req, res, next) =>{
    if(req.file){
        let image = req.file
        await Product.findByIdAndUpdate({ _id:req.params.id }, { $set: { imageUrl: image.filename } })
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

exports.getCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find()

    res.render('admin/categoryManagement', { categories, index:1 })
    next()
})

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/admin/dashboard/addCategories')
}