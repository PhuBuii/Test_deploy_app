const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add some text'],
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Update comment count on Post
commentSchema.post('save', async function() {
    await this.model('Post').findByIdAndUpdate(this.post, {
        $inc: { commentCount: 1 }
    });
});

module.exports = mongoose.model('Comment', commentSchema);
