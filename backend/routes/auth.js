const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/signup', userController.signup);

// Login a user
router.post('/login', userController.login);

module.exports = router;