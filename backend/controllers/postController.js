const Post = require("../models/post");
const User = require("../models/user");
const Comment = require('../models/comment');

function getFormattedDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

//gets all blog post
exports.getPosts = async (req, res) =>{
    try {
        const posts = await Post.find().populate('author', 'username');

        const formattedPosts = posts.map(post => ({
            ...post._doc,
            published: getFormattedDate(post.published) // Format the published date
        }));

        // Send the formatted posts
        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server error');
    }
}

//gets a specific blog post by id
exports.getPostById = async (req, res) => {
    try{
        const postId = req.params.id;

        // Retrieve the post by ID from the database
        const post = await Post.findById(postId).populate('comments').exec();

        if(!post){
            return res.status(404).send('Post not found');
        }

        const formattedPost = {
            ...post._doc, // Spread the original post document
            published: getFormattedDate(post.published) // Format the published date
        };

        res.status(200).json(formattedPost);
    }catch(error){
        console.error("Error fetching post: ", error);
        res.status(500).send('Server error');
    }
};

//creates new post
exports.createPost = async (req, res) => {
    try{
        const user = req.user;

        //only user's role with admin can write post
        if(user.role !== 'admin'){
            return res.status(403).send('Forbidden: Only admins can create posts');
        }

        const { title, content, description, readTime } = req.body;

        const newPost = new Post({
            title,
            description,
            content,
            published: new Date(),
            author: user.username, // Use the username from the authenticated user
            readTime
        });

        await newPost.save();
        res.status(201).json(newPost);
    }catch(error){
        console.error('Error creating post:', error); // Log the error
        res.status(500).send('Server error');
    }
}

//edits the post
exports.editPost = async (req, res) =>{
    try{
        const user = req.user;
        if(user.role !== 'admin'){
            return res.status(403).send('Forbidden: Only admins can create posts');
        }

        const { title, description, content, readTime } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, description, content , readTime },
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }

        res.status(200).json(updatedPost);
    }catch(error){
        console.error('Error editing post:', error); 
        res.status(500).send('Server error');
    }
}

//deletes the post
exports.deletePost = async (req, res) =>{
    try{
        const user = req.user;
        if(user.role !== 'admin'){
            return res.status(403).send('Forbidden: Only admins can create posts');
        }
        
        await Post.findByIdAndDelete(req.params.id);

        const posts = await Post.find().populate('author', 'username');
        res.status(200).json(posts);
    }catch(error){
        console.error('Error deleting post:', error); 
        res.status(500).send('Server error');
    }
}

