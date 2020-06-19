const express = require('express');
const router = express.Router();

// Import Controllers
const { requireSignin} = require('../controllers/auth.controllers');
const { read} = require('../controllers/user.controllers');

// Import Validators
router.get('/user/:id', requireSignin, read);

module.exports = router;