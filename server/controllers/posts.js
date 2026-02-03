const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        let query;

        // If user is admin/superadmin, they can see all posts or filter
        if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
            query = Post.find().populate('author', 'username');
        } else {
            // Public only sees published
            query = Post.find({ status: 'published' }).populate('author', 'username');
        }

        const posts = await query;
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.author = req.user.id;

        const post = new Post(req.body);
        await post.save();

        res.status(201).json({ success: true, data: post });
    } catch (err) {
        console.error('Create Post Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user is post owner or superadmin
        if (post.author.toString() !== req.user.id && req.user.role !== 'superadmin' && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'User not authorized to update this post' });
        }

        // Update fields individually to trigger pre-save hook for slug if title changed
        Object.keys(req.body).forEach(key => {
            post[key] = req.body[key];
        });

        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        console.error('Update Post Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user is post owner or superadmin
        if (post.author.toString() !== req.user.id && req.user.role !== 'superadmin' && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/v1/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({ success: true, data: post.likes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
