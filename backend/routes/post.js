const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");

const { authenticateJWT, checkAdmin } = require('../middleware/auth');

//creates a new post
router.post('/createpost', authenticateJWT, checkAdmin, postController.createPost);

//gets all post
router.get('/getallpost', postController.getPosts);

//gets post by id
router.get('/getpost/:id', postController.getPostById);

//update post
router.patch('/editpost/:id', authenticateJWT, checkAdmin, postController.editPost);

//delete post
router.delete('/deletepost/:id', authenticateJWT, checkAdmin, postController.deletePost);

module.exports = router;