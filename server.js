const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')
const catchAsync = require('./utils/catchAsync')

dotenv.config({ path: './config.env' })

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

const connectDB = catchAsync(async () => {
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    mongoose.connection
        .once("open", () => console.log("database connected successfully"))
        .on("error", error => {
            console.log("error: ", error);
        })
})

connectDB().then(() => {
    app.listen(3500, () => {
        console.log('server started')
    })
})