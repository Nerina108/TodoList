const User = require('../models/user.model');

// Reading data from signed in user  
const read = (req, res) => {
    const userId = req.params.id;

    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json(user)
    })
}


module.exports = { read };