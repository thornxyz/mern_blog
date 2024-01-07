require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Post = require('./models/Post')

const multer = require('multer');
const cloudinary = require('./cloudinary.js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mern-blog',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    },
});

const uploadMiddleware = multer({ storage: storage });

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SALT;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }

});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
        return res.status(400).json('User not found');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {    
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

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
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


app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.listen(4000);
