const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Product = require("./../models/productModel");
const Category = require("./../models/categoryModel");
const Cart = require("./../models/cartModel");
const Profile = require("./../models/profileModel");
const Wishlist = require("./../models/wishlistModel");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const nodemailer = require('nodemailer')
const Banner = require("../models/bannerModel");
const Order = require("../models/orderModel");
const Coupon = require('../models/couponModel')


// --------------------------------------------------------------------------------------------------------------
// Email OTP Verify

let fullName
let email
let name
let phone
let password
let passwordConfirm

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'hersey@gmail.com',
        pass: 'fttkzontjctkofmg',
    }

});

let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

// --------------------------------------------------------------------------------------------------------------


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOPtions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
        cookieOPtions.secure = true;
    }
    res.cookie("jwt", token, cookieOPtions);

    //remove the password from the output
    user.password = undefined;
};

// exports.signup = catchAsync(async (req, res, next) => {
//     const newAdmin = await Admin.create({
//         name : req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm
//     })

//     createSendToken(newAdmin, 201, res);
//     next()
// })

exports.adminLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError(res.redirect('/admin/login')));
    }

    //to check if admin exists and password is correct
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        return next(new AppError(res.redirect('/admin/login')));
    }

    //if everything is correct, send token to client
    createSendToken(admin, 201, res);

    res.redirect("/admin/dashboard");
    next();
});

exports.otp = catchAsync(async (req, res, next) => {
    fullName = req.body.fullName,
    name = req.body.name,
    email = req.body.email,
    phone = req.body.phone,
    password = req.body.password,
    passwordConfirm = req.body.passwordConfirm;

    const user = await User.findOne({ email: email })

    if(!user) {
        
        // send mail with defined transport object
        let mailOptions = {
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            res.render('user/OTP');
        });

    } else {
        res.redirect('/login')
    }
})

exports.resendOTP = catchAsync(async(req, res, next) => {
    var mailOptions={
       to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp',{msg:"otp has been sent"});
    });
})

exports.verifyOTP = catchAsync(async(req, res, next) => {
    if(req.body.otp==otp){
        const newUser = await User.create({
            fullName: fullName,
            name: name,
            email: email,
            phone: phone,
            password: password,
            passwordConfirm: passwordConfirm,
        });
    
        createSendToken(newUser, 201, res);
        res.redirect("/");
        next();
    }
    else{
        res.render('user/OTP',{msg : 'otp is incorrect'});
    }
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError(res.redirect('/login')));
    }

    //to check if user exists and password is correct
    const user = await User.findOne({
        $and: [{ email }, { status: "Active" }],
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError(res.redirect('/login')));
    }

    //if everything is correct, send token to client
    createSendToken(user, 201, res);
    res.redirect("/");
    next();
});

exports.addCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({
        name: req.body.name,
    });
    res.redirect("/admin/category");
});

exports.addProducts = catchAsync(async (req, res, next) => {
    req.files.forEach((img) => { });
    console.log(req.files);
    const productImages =
        req.files != null ? req.files.map((img) => img.filename) : null;
    console.log(productImages);
    const newProduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price,
        quantity: req.body.quantity,
        imageUrl: productImages,
    });
    res.redirect("/admin/dashboard/manageProducts");
    next();
});

exports.addBanner = catchAsync(async (req, res, next) => {
    req.files.forEach((img) => { });
    console.log(req.files);
    const productImages =
        req.files != null ? req.files.map((img) => img.filename) : null;
    console.log(productImages);
    const newBanner = await Banner.create({
        image: productImages,
    });
    res.redirect("/admin/dashboard/manageBanner");
    next();
});

exports.addCoupon = catchAsync(async(req, res, next) => {
    console.log(req.body);
    const newCoupon = await Coupon.create({
        couponCode: req.body.couponCode,
        discount: req.body.discount,
        startDate: req.body.startDate,
        expiryDate: req.body.expiryDate,
        limit: req.body.limit,
    });
    res.redirect("/admin/manageCoupon");
})

exports.addToCart = catchAsync(async (req, res, next) => {
    const userId = req.user;
    const productId = req.params.id;
    const quantity = req.body.quantity ? req.body.quantity : 1;
    const cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    const total = product.price * quantity;
    console.log(total);
    if (cart) {
        const exist = await Cart.findOne({
            userId,
            "product.productId": productId,
        });
        if (exist != null) {
            await Cart.findOneAndUpdate(
                { userId, "product.productId": productId },
                {
                    $inc: {
                        "product.$.quantity": 1,
                        "product.$.total": total,
                        cartTotal: total,
                    },
                }
            );
        } else {
            await Cart.findOneAndUpdate(
                { userId },
                {
                    $push: { product: { productId, quantity, total } },
                    $inc: { cartTotal: total },
                }
            );
        }
    } else {
        const addCart = await Cart.create({
            userId:req.user._id,
            product: [{ productId, quantity, total }],
            cartTotal: total,
        });
    }
    res.redirect("back");
    next();
});

exports.addOrder = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const cart = await Cart.findOne({ userId });
    const couponId = cart.discount.couponId
    const addIndex = req.body.addIndex
    let profile = await Profile.findOne({ userId })
    profile = profile.address[addIndex]
    const grandTotal = cart.grandTotal
    const products = cart.product;
    const cartId = cart._id.toString();
    const now = new Date()
    const deliveryDate = now.setDate(now.getDate() + 7)
    const paymentMethod = req.body.paymentMethod;
    if (paymentMethod === "Cash on Delivery") {
        const newOrder = await Order.create({
            userId: userId,
            product: products,
            cartTotal: grandTotal,
            address: profile,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: "Pending",
            deliveryDate: deliveryDate,
        });
        for(let product of products) {
            let id = product.productId
            let quantity = product.quantity
            await Product.updateOne({ _id: id }, { $inc: { quantity: -quantity } })
        }
        if(couponId != null){
            await Coupon.findByIdAndUpdate({ _id: couponId }, { $push: { users: userId }, $inc: { limit: -1 } })
        }
        await Cart.findByIdAndDelete({ _id: cart._id });
        
        res.json({ status: true });
    } else {
        var instance = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET,
        });
        instance.orders.create(
            {
                amount: grandTotal * 100,
                currency: "INR",
                receipt: cartId,
            },
            function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ status: false, order });
                }
            }
        );
    }
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
    
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    const grandTotal = cart.grandTotal;
    const products = cart.product;
    const couponId = cart.discount.couponId
    const details = req.body;
    const now = new Date()
    const deliveryDate = now.setDate(now.getDate() + 7)
    let add = details['address'].split('&')
    add = add[1].split('=')
    const addIndex = parseInt(add[1])
    let profile = await Profile.findOne({ userId })
    profile = profile.address[addIndex]
    console.log(addIndex);
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", process.env.RZP_KEY_SECRET);
    hmac.update(
        details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");

    if (hmac == details["payment[razorpay_signature]"]) {
        console.log("order Successfull");

        const newOrder = await Order.create({
            userId: userId,
            product: products,
            cartTotal: grandTotal,
            address: profile,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
            deliveryDate: deliveryDate,
        })
            .then(async (data) => {
                for(let product of products) {
                    let id = product.productId
                    let quantity = product.quantity
                    await Product.updateOne({ _id: id }, { $inc: { quantity: -quantity } })
                }
                await Cart.findByIdAndDelete({ _id: cart._id });
                if(couponId != null){
                    await Coupon.findByIdAndUpdate({ _id: couponId }, { $push: { users: userId }, $inc: { limit: -1 } })
                }
                res.json({ status: true, data });
            })
            .catch((err) => {
                res.json({ status: false, err });
            });
    } else {
        res.json({ status: false });
        console.log("payment failed");
    }
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
    let userId = req.user;
        let productId = req.params.id;
        let wlist = await Wishlist.findOne({ userId });
        if (wlist) {
            await Wishlist.findOneAndUpdate({ userId }, { $addToSet: { productId } });
        } else {
            const addWishlist = await Wishlist.create({
                userId: req.user._id,
                productId: productId,
            });
        }
        res.redirect("back");
   
    next();
});

exports.addProfile = catchAsync(async (req, res, next) => {
    let userId = req.user;
    let { fullName, pincode, country, currentAddress, city, state } = req.body;
    let profile = await Profile.findOne({ userId });

    if (profile) {
        await Profile.findOneAndUpdate(
            { userId },
            {
                $push: {
                    address: { fullName, pincode, country, currentAddress, city, state },
                },
            }
        );
    } else {
        const newProfile = await Profile.create({
            userId: mongoose.Types.ObjectId(req.user._id),
            gender: req.body.gender,
            address: [{ fullName, pincode, country, currentAddress, city, state }],
        });
    }
    res.redirect("/address");
    next();
});

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
    const orderId = req.params.id;
    const productId = req.params.prod
    const orderStatus = req.params.status;
    console.log(orderStatus);

    if (orderStatus == 'Order Placed') {
        await Order.findOneAndUpdate({_id: orderId, 'product.productId': productId },
            {
                $set:
                    { 'product.$.orderStatus': "Processed" }
            })
    } else if (orderStatus == "Processed") {
        await Order.findOneAndUpdate({_id: orderId, 'product.productId': productId },
            {
                $set:
                    { 'product.$.orderStatus': "Shipped" }
            })
    } else if (orderStatus == "Shipped") {
        await Order.findOneAndUpdate({_id: orderId, 'product.productId': productId },
            {
                $set:
                    { 'product.$.orderStatus': "Delivered" }
            })
    }
     else if(orderStatus == "Cancelled") {
        await Order.findOneAndUpdate({_id: orderId, 'product.productId': productId },
            {
                $set:
                    { 'product.$.orderStatus': "Cancelled" }
            })
    }
    res.redirect("back");
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    console.log(token);
    if (!token) {
        return next(
            res.redirect('/login')
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    console.log(decoded)
    const currentUser = await User.findOne({_id:decoded.id});
    console.log(currentUser)
    if (!currentUser) {
        return next(
            new AppError(
                res.redirect('/login')
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently changed password! Please log in again.", 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
});

exports.adminProtect = catchAsync(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    console.log(token);
    if (!token) {
        return next(
            res.redirect('/admin/login')
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    console.log(decoded)
    const currentAdmin = await Admin.findOne({_id:decoded.id});
    console.log(currentAdmin)
    if (!currentAdmin) {
        return next(
            new AppError(
                res.redirect('/admin/login')
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.admin = currentAdmin;
    // res.locals.user = currentUser;
    next();
});

// exports.restrictTo = (Admin) => {
//     return (req, res, next) => {
//         if (!Admin.includes(req.user.Admin)) {
//             return next(new AppError('you do not have permission'))
//         }
//         next()
//     }
// }
