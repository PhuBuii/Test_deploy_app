const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    tags: [String],
    featuredImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create post slug from the title
postSchema.pre('save', async function() {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .split(' ')
            .join('-')
            .replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }
});

// Cascade delete comments when a post is deleted
postSchema.pre('remove', async function() {
    await this.model('Comment').deleteMany({ post: this._id });
});

// Reverse populate with virtuals
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

module.exports = mongoose.model('Post', postSchema);
