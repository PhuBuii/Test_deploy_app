const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost
} = require('../controllers/posts');

const { addComment } = require('../controllers/comments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to optionally attach user to request if token is present
const optionalAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch (err) {
            // Token is invalid, but we don't throw error for optional auth
            req.user = null;
        }
    }
    next();
};

router.route('/')
    .get(optionalAuth, getPosts)
    .post(protect, checkPermission('create_post'), createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.route('/:id/like')
    .put(protect, likePost);

router.route('/:postId/comments')
    .post(protect, addComment);

module.exports = router;
