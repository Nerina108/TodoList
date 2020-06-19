const express = require('express');
const router = express.Router();

// Import Controllers
const { registerUser, loginUser, googleAuth } = require('../controllers/auth.controllers')

// Local Auth
router.post('/signup', registerUser)
router.post('/signin', loginUser)

// Google Auth
router.post('/google-login', googleAuth);

module.exports = router