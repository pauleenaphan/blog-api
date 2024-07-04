const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    published: { type: Date, required: true },
    author: { type: String, required: true },
    readTime: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]  
})

module.exports = mongoose.model('Post', postSchema);