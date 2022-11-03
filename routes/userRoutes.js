const express = require('express')
const authcontroller = require('../controllers/authController')


const router = express.Router()



router.post('/signup', authcontroller.signup)
router.post('/login', authcontroller.login)
router.get('/home', (req, res) => {
    res.render('user/index')
})
router.get('/login', (req, res) => {
    res.render('user/sign-in')
})

router.get('/signup', (req, res) => {
    res.render('user/sign-up')
})



module.exports = router