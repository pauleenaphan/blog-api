const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, role: "user" });
    await newUser.save();

        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // Create a JWT token
    const payload = { id: user._id, email: user.email, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10h' });

    res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
