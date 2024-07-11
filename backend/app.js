//!packages and modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const cors = require('cors');

//!routes from other files
const authRouter = require('./routes/auth');
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ 
    origin: /\.netlify\.app$/, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));


// secret key used to sign the session ID cookies
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Restore session data from the cookie

//routes
//putting other functions in the parameters will apply it globally to all of the routes
app.use('/auth', authRouter);
app.use("/post", postRouter); 
app.use("/comment", commentRouter);

// Error handler for 404
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Error handler for server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

//Passport configuration
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try{
            const user = await User.findOne({ email: email });
            if(!user){
                return done(null, false, { message: "Incorrect email" });
            }

            //Compare hashed password (using bcrypt) from database with plaintext password
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
);

//determines which data of the user object should be stored in the session
passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username });
});


//used to retrieve the user object based on the user id stored in the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    };
});

//mongodb link 
const dev_db_url = process.env.DEV_DB_URL;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 3001; // Use the port specified in environment variable or default to 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
