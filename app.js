const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')



const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')

const app = express()

//view engine
app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'hbs')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))


app.use("/", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });


app.use('/', userRouter)
app.use('/admin', adminRouter)

 

module.exports = app;