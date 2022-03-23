const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const verifyTocken = require('../middleware/auth')


//GET api/auth/
// Check if user is authenticated
// Public 
router.get('/', verifyTocken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// POST api/auth/register
// Public

router.post('/register', async (req, res) => {

    const { username, password } = req.body
    // Simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' })

    try {
        // Check for existing user
        const user = await User.findOne({ username })

        if (user)
            return res
                .status(400)
                .json({ success: false, message: 'Username already taken' })

        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({
            success: true,
            message: 'User created successfully',
            accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// POST /api/auth/login
// public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' })

    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400)
                .json({ success: false, message: 'Incorrect username or password' })
        }

        // check password
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            return res.status(400)
                .json({ success: false, message: 'Missing username or password' })
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({
            success: true,
            message: 'Login in successfully',
            accessToken
        })
    } catch (err) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }

})


module.exports = router