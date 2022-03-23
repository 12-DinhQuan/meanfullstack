const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const cors = require('cors')

const authRouter = require('./router/auth')
const postRouter = require('./router/post')

const app = express()
const port = process.env.POST || 5000

const connectDB = async () => {
    try {
        //mongodb+srv://quandinh:1234@mern-leanmit.nub8q.mongodb.net/mern-leanmit?retryWrites=true&w=majority
        await mongoose.connect(`mongodb+srv://quandinh:1234@mern-leanmit.nub8q.mongodb.net/mern-leanmit?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('MongoDB Connection Succeeded.')
    } catch (err) {
        console.error('Error in DB connection: ' + err)
        process.exit(1)
    }
}

connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})