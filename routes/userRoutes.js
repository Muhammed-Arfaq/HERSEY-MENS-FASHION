const express = require('express')
const authcontroller = require('../controllers/authController')
const usercontroller = require('./../controllers/userController')

const router = express.Router()



router
    .route('/signup')
    .post(authcontroller.signup)
    .get(usercontroller.userRegister)

router
    .route('/login')
    .post(authcontroller.login)
    .get( usercontroller.userLogin)

router
    .route('/')
    .get(usercontroller.userHome)

router
    .route('/shop')
    .get(usercontroller.allProductsUser)

router
    .route('/productDetails/:id')
    .get(usercontroller.singleProduct)

router
    .route('/cart/:id')    
    .post(authcontroller.protect, authcontroller.addToCart)    

router
    .route('/shoppingCart')
    .get(authcontroller.protect, usercontroller.findCart)


module.exports = router