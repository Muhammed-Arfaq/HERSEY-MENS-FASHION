const express = require("express");
const authcontroller = require("./../controllers/authController");
const admincontroller = require("./../controllers/adminController");

const router = express.Router();


router  
    .route("/login")
    .get(admincontroller.loginPage)
    .post(authcontroller.adminLogin)

router
    .route('/dashboard')
    .get(admincontroller.adminHome)

router
    .route("/addProducts")
    .get(admincontroller.addProduct)
    .post(authcontroller.addProducts)

router
    .route('/dashboard/manageProducts')
    .get(admincontroller.getAllProducts)

router
    .route("/category")
    .post(authcontroller.addCategory)
    .get(admincontroller.getCategory)

router
    .route('/dashboard/manageUsers')
    .get(admincontroller.getAllUsers)

router
    .route('/dashboard/blockUser/:id')
    .post(admincontroller.blockUser)

router
    .route('/dashboard/unBlockUser/:id')
    .post(admincontroller.unBlockUser)

router
    .route('/dashboard/editProducts/:id')
    .get(admincontroller.editProductRender)
    .post(admincontroller.editProduct)

router
    .route('/dashboard/deleteProducts/:id')
    .post(admincontroller.deleteProduct)

router
    .route('/dashboard/addCategories')
    .get(admincontroller.getCategory)

router
    .route('/dashboard/deleteCategory/:id')
    .post(admincontroller.deleteCategory)

router
    .route('/addBanner')
    .get(admincontroller.addBanner)
    .post(authcontroller.addBanner)

router
    .route('/dashboard/manageBanner')
    .get(admincontroller.getBanner)

router
    .route('/dashboard/manageBanner/:id')   
    .post(admincontroller.deleteBanner)
 

module.exports = router;
