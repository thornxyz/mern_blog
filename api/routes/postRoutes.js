require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post.js');
const { uploadMiddleware, cloudinary } = require('../setup/cloudinary.js');

const secret = process.env.SALT;

router.post('/', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { token } = req.cookies;
        const { title, summary, content } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized', details: 'JWT token is missing' });
        }

        const decodedToken = jwt.verify(token, secret);
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mern-blog',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'],
        });

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: cloudinaryResponse.secure_url,
            author: decodedToken.id,
        });

        res.json(postDoc);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
});

router.put('/:id', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.cookies;
        const { title, summary, content } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized', details: 'JWT token is missing' });
        }

        const decodedToken = jwt.verify(token, secret);

        const postDoc = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json({ error: 'Post not found', details: `Post with ID ${id} does not exist` });
        }

        const isAuthor = postDoc.author.toString() === decodedToken.id;
        if (!isAuthor) {
            return res.status(403).json({ error: 'Forbidden', details: 'You are not the author of this post' });
        }

        let newPath = null;

        if (req.file) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'mern-blog',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'],
            });

            newPath = cloudinaryResponse.secure_url;
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath || postDoc.cover,
        });

        res.json(postDoc);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ updatedAt: -1 })
            .limit(20);

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);

        if (!postDoc) {
            return res.status(404).json({ error: 'Post not found', details: `Post with ID ${id} does not exist` });
        }

        res.json(postDoc);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
});

module.exports = router;
