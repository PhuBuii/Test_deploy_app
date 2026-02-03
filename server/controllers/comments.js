const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add comment to post
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        req.body.post = req.params.postId;
        req.body.author = req.user.id;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = await Comment.create(req.body);

        res.status(201).json({ success: true, data: comment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Make sure user is comment owner or admin
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
