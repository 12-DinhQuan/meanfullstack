const express = require('express')
const router = express.Router()
const verifyTocken = require('../middleware/auth')

const Post = require('../models/Post')


// GET api/posts
// get post
// private
router.get('/', verifyTocken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username'])
        res.json({ success: true, posts })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// POST api/posts
// create post
// private
router.post('/', verifyTocken, async (req, res) => {
    const { title, description, url, status } = req.body

    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' })
    }

    try {
        const newPost = new Post({
            title,
            description,
            url: (url.startsWith('https://')) ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })

        await newPost.save()

        res.json({ success: true, message: 'Happy leading!', post: newPost })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// PUT api/posts
// updtate post
// private
router.put('/:id', verifyTocken, async (req, res) => {
    const { title, description, url, status } = req.body

    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' })
    }

    try {
        let updatePost = {
            title,
            description: description || '',
            url: (url.startsWith('https://')) ? url : `https://${url} || ''`,
            status: status || 'TO LEARN'
        }

        const postUpdateCondtion = { _id: req.params.id, user: req.userId }

        updatePost = await Post.findOneAndUpdate(postUpdateCondtion, updatePost, { new: true })

        if (!updatePost) {
            return res.status(401).json({ success: false, message: 'Post not found' })
        }

        res.json({ success: true, message: 'Post successfully updated', post: updatePost })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// PUT api/posts
// delete post
// private
router.delete('/:id', verifyTocken, async (req, res) => {
    try {
        const postDeleteCondtion = { _id: req.params.id, user: req.userId }
        const deletePost = await Post.findOneAndDelete(postDeleteCondtion)
        if (!deletePost) {
            return res.status(401).json({ success: false, message: 'Post not found' })
        }

        res.json({ success: true, message: 'Post successfully deleted', post: deletePost })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router
