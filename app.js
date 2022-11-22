const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const multer = require('multer')

const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')

const app = express()

app.use((req, res, next) => {
  res.header("Cache-Control", "private,no-cache,no-store,must-revalidate");
  next();
});

//view engine
app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))


//File upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    console.log(file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
})

const fileFilter = (req, file, cb) => {
   if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
    cb(null, true)
   }
   else{
    cb(null, false)
   }
}

app.use(multer({dest:'public/img/', storage: fileStorage, fileFilter: fileFilter}).array("imageUrl", 10))


app.use('/', userRouter)
app.use('/admin', adminRouter)

 

module.exports = app;