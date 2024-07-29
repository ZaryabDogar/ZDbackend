const express = require('express')
const router = express.Router();
const user = require('../models/User')
const jwt = require('jsonwebtoken');

const EMAIL_SECRET = 'verify yourself!';
router.get('/verifyuser/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { email } = jwt.verify(token, EMAIL_SECRET);
        const User = await user.findOne({ email });

        if (!User) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        User.isVerified = true;
        await User.save();
        return res.redirect('http://localhost:3000/verification_success');

    } catch (error) {
        console.log('Error occurred: ' + error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
module.exports = router;
