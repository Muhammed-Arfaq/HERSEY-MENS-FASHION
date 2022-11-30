const express = require("express");
const authcontroller = require("./../controllers/authController");
const admincontroller = require("./../controllers/adminController");

const router = express.Router();


// router  
//     .route("/signup")
//     .get(admincontroller.addAdmin)
//     .post(authcontroller.signup)

router  
    .route("/login")
    .get(admincontroller.loginPage)
    .post(authcontroller.adminLogin)

router
    .route('/logout')
    .get(authcontroller.adminProtect, admincontroller.adminLogout)

router
    .route('/dashboard')
    .get(authcontroller.adminProtect, admincontroller.adminHome)

router
    .route("/addProducts")
    .get(authcontroller.adminProtect, admincontroller.addProduct)
    .post(authcontroller.adminProtect, authcontroller.addProducts)

router
    .route('/dashboard/manageProducts')
    .get(authcontroller.adminProtect, admincontroller.getAllProducts)

router
    .route("/category")
    .post(authcontroller.adminProtect, authcontroller.addCategory)
    .get(authcontroller.adminProtect, admincontroller.getCategory)

router
    .route('/dashboard/manageUsers')
    .get(authcontroller.adminProtect, admincontroller.getAllUsers)

router
    .route('/dashboard/blockUser/:id')
    .post(authcontroller.adminProtect, admincontroller.blockUser)

router
    .route('/dashboard/unBlockUser/:id')
    .post(authcontroller.adminProtect, admincontroller.unBlockUser)

router
    .route('/dashboard/editProducts/:id')
    .get(authcontroller.adminProtect, admincontroller.editProductRender)
    .post(authcontroller.adminProtect, admincontroller.editProduct)

router
    .route('/dashboard/deleteProducts/:id')
    .post(authcontroller.adminProtect, admincontroller.deleteProduct)

router
    .route('/dashboard/addCategories')
    .get(authcontroller.adminProtect, admincontroller.getCategory)

router
    .route('/dashboard/deleteCategory/:id')
    .post(authcontroller.adminProtect, admincontroller.deleteCategory)

router
    .route('/addBanner')
    .post(authcontroller.adminProtect, authcontroller.addBanner)

router
    .route('/dashboard/manageBanner')
    .get(authcontroller.adminProtect, admincontroller.getBanner)

router
    .route('/dashboard/manageBanner/:id')   
    .post(authcontroller.adminProtect, admincontroller.deleteBanner)

router
    .route('/manageOrder')
    .get(authcontroller.adminProtect, admincontroller.allOrders)

router
    .route('/manageOrder/:id')
    .get(authcontroller.adminProtect, admincontroller.manageOrder)

router  
    .route('/changeStatus/:id/:prod/:status')
    .post(authcontroller.adminProtect, authcontroller.changeOrderStatus)

router
    .route('/invoice/:id')
    .get(admincontroller.invoice)
 

module.exports = router;
