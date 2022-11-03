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

// router
//     .route("/allUsers")
//     .get( admincontroller.getAllUsers)


router
    .route("/products")
    .get(authcontroller.protect, admincontroller.getAllProducts)
    .post(authcontroller.products)


// router
//     .route("/products/edit")
//     .post(admincontroller.updateProduct);


router
    .route("/category")
    .post(authcontroller.addCategory)
    .get(admincontroller.getCategory)
    

router
    .route('/dashboard/manageUsers')
    .get(admincontroller.getAllUsers)
 

module.exports = router;
