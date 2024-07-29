const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const user = require('../models/User'); // Ensure this path is correct
const JWT_SECRET = 'dont know vcbvbnvbnv';

router.post('/resetpassword/:token',
    body('password', 'please input authentic password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "please input valid data" });
        }
        const { token } = req.params;
        const { password } = req.body;

        try {
            // Verify JWT token
            const decoded = jwt.verify(token, JWT_SECRET);
            const email = decoded.email;

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Find the user by email and update the password
            const existingUser = await user.findOne({ email: email });
            if (!existingUser) {
                return res.status(400).json({ success: false, message: "User not found" });
            }

            existingUser.password = hashedPassword;
            await existingUser.save();

            res.json({ success: true, message: 'Password has been reset' });
        } catch (error) {
            console.log("Error occurred: " + error);
            res.status(500).json({ success: false, message: 'Invalid or expired token' });
        }
    }
);

module.exports = router;
