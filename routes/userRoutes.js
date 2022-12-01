const express = require('express')
const authcontroller = require('../controllers/authController')
const usercontroller = require('./../controllers/userController')

const router = express.Router()

router
    .route('/otp')
    .post(authcontroller.otp)

router
    .route('/resendOTP')
    .post(authcontroller.resendOTP)

router 
    .route('/verifyOTP')
    .post(authcontroller.verifyOTP)

router
    .route('/signup')
    .get(usercontroller.userRegister)

router
    .route('/login')
    .post(authcontroller.login)
    .get( usercontroller.userLogin)

router
    .route('/logout')
    .get(authcontroller.protect, usercontroller.userLogout)

router
    .route('/')
    .get( usercontroller.userHome)

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

router
    .route('/deleteCartProduct/:id/:price/:quantity')
    .post(authcontroller.protect, usercontroller.deleteCartProducts)

router
    .route('/incQuantity/:id/:price')
    .post(authcontroller.protect, usercontroller.incQuantity)

router
    .route('/decQuantity/:id/:price')
    .post(authcontroller.protect, usercontroller.decQuantity)

router
    .route('/wishlist/:id')
    .post(authcontroller.protect, authcontroller.addToWishlist)

router
    .route('/wishlist')
    .get(authcontroller.protect, usercontroller.productWishlist)

router
    .route('/deleteWishListProduct/:id')
    .post(authcontroller.protect, usercontroller.deleteWishListProduct)

router
    .route('/userProfile')  
    .get(authcontroller.protect, usercontroller.userProfile)  

router
    .route('/addProfile/:id')    
    .post(authcontroller.protect, authcontroller.addProfile)

router
    .route('/address')
    .get(authcontroller.protect, usercontroller.addAddress)

router
    .route('/updateAddress/:id')
    .get(authcontroller.protect, usercontroller.updateAddress)
    .post(authcontroller.protect, usercontroller.updateUserAddress)

router
    .route('/changeAddress')
    .post(authcontroller.protect, usercontroller.checkout)

router
    .route('/deleteAddress/:id')
    .post(authcontroller.protect, usercontroller.deleteAddress)

router
    .route('/checkout')
    .get(authcontroller.protect, usercontroller.checkout)

router
    .route('/order')
    .get(authcontroller.protect, usercontroller.orderPage)
    .post(authcontroller.protect, authcontroller.addOrder)

router
    .route('/orderSuccess')
    .get(authcontroller.protect, usercontroller.orderSuccess)

router
    .route('/cancelOrder/:id')
    .post(authcontroller.protect, usercontroller.cancelOrder)

router  
    .route('/verifyPayment')
    .post(authcontroller.protect, authcontroller.verifyPayment)

router
    .route('/404')
    .get(usercontroller.pageNotFound)

module.exports = router