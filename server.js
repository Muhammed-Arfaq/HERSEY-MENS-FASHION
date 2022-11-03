const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

mongoose.connection
.once("open",()=>console.log("database connected successfully"))
.on("error",error => {
    console.log("error: ",error);
})

app.listen(3500, () => {
    console.log('server started')
})