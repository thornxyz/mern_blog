require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post.js');
const { uploadMiddleware, cloudinary } = require('../setup/cloudinary.js');

const secret = process.env.SALT;

router.post('/', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;

        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mern-blog',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'],
        });

        try {
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: cloudinaryResponse.secure_url,
                author: info.id,
            });
            res.json(postDoc);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create post', details: error.message });
        }
    });
});

router.put('/:id', uploadMiddleware.single('file'), async (req, res) => {
    const { id } = req.params;
    let newPath = null;

    if (req.file) {
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mern-blog',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'],
        });

        newPath = cloudinaryResponse.secure_url;
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to verify token', details: err.message });
        }

        try {
            const postDoc = await Post.findById(id);
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

            if (!isAuthor) {
                return res.status(400).json('You are not the author');
            }

            await postDoc.updateOne({
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                cover: newPath ? newPath : postDoc.cover,
            });

            res.json(postDoc);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update post', details: error.message });
        }
    });
});

router.get('/', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

module.exports = router;
