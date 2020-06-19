// Import User Model
const User = require('../models/user.model');

// Import JWT packagges 
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Import OAuth2Client (Google Auth)
const { OAuth2Client } = require('google-auth-library');

// Import Node-Fetch
const fetch = require('node-fetch');

//Register new user 
const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        // Create new User
        const newUser = new User({ name, email, password });
        newUser.save();

        return res.status(201).json({
            message: 'User created succesfully! Please signin',
            newUser
        });
    })
};


//User login authentication
const loginUser = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            })
        }
        // authenticate (validate password - coming from User model)
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password does not match'
            })
        }

        // generate a token - send it to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        const { _id, name, email, role, todos } = user;

        return res.json({
            token,
            user: { _id, name, email, role, todos }
        });

    })
};

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET // req.user
})


const adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }

        if (user.role !== "admin") {
            return res.status(400).json({
                error: "Admin resource. Access denied"
            })
        }

        req.profile = user;
        next()
    })
}

// client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = (req, res) => {
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
        .then(response => {
            const { email_verified, name, email } = response.payload;

            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
                        const { _id, email, name, role, todos } = user;

                        return res.json({
                            token,
                            user: { _id, email, name, role, todos }
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                })
            }
        })
}

module.exports = {
    registerUser,
    loginUser,
    requireSignin,
    adminMiddleware,
    googleAuth
};