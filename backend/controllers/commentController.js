const Post = require("../models/post");
const User = require("../models/user");
const Comment = require('../models/comment');

exports.addComment = async(req, res) =>{
    try{
        //checks if user is logged in
        if(!req.user){
            return res.status(401).send('Unauthorized: User not logged in');
        }
        const { content } = req.body;

        //Find the post to add the comment to
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send('Not Found: Post does not exist');
        }

        //Create a new comment
        const newComment = new Comment({
            content,
            author: req.user.username, 
            post: post,
            date: new Date()
        });

        //Save the comment to the database
        await newComment.save();

        //Add the comment reference to the post (if necessary)
        post.comments.push(newComment._id);
        await post.save();

        // Send a response with the newly created comment
        res.status(201).json(newComment);
    }catch(error){
        console.error('Error adding comment:', error);
        res.status(500).send('Server error');
    }
}

exports.viewComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log("Postid", postId);

        //Find comments for the specific post
        //cant just pass in req.params because it is an object
        const comments = await Comment.find({ post: postId })
            .populate('post')
            .populate('author', 'username');

        if (comments.length === 0) {
            return res.status(404).send('No comments found for this post');
        }

        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments: ", error);
        res.status(500).send("Server Error");
    }
}
exports.deleteComments = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).send('Forbidden: Only admins can delete comments');
        }

        //checks if the comments exists
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send('Not Found: Comment does not exist');
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Server error');
    }
}