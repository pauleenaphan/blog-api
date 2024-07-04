const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateJWT, checkAdmin } = require('../middleware/auth');

//add comment to post
router.post('/addcomment/:id', authenticateJWT, commentController.addComment);

//view all comments on a post
router.get('/viewcomments/:postId', commentController.viewComments);

//deletes a comment
router.delete('/deletecomment/:id', authenticateJWT, commentController.deleteComments);

module.exports = router;