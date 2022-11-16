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

router
    .route('/deleteCartProduct/:id')
    .post(authcontroller.protect, usercontroller.deleteCartProducts)

router
    .route('/incQuantity/:id')
    .post(authcontroller.protect, usercontroller.incQuantity)

router
    .route('/decQuantity/:id')
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
    .route('/deleteAddress/:id')
    .post(authcontroller.protect, usercontroller.deleteAddress)

router
    .route('/checkout')
    .get(usercontroller.checkout)


module.exports = router