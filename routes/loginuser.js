const express = require('express')
const router = express.Router();
const user = require('../models/User')
const bcrypt = require('bcrypt');

const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dont know vcbvbnvbnv'; // replace with your actual secret key
router.post("/loginuser",
    // username must be an email
    body('email', "please input correct email").isEmail(),
    // password must be at least 5 chars long
    body('password', "please input authentic password").isLength({ min: 5 })
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const {email, password } = req.body;
        
        try {
            // Find user by email
            const existingUser = await user.findOne({email:email});
            if (!existingUser) {
                return res.status(400).json({ success: false, message: "User not found" });
            }
            // Compare passwords
            const isMatch = await bcrypt.compare(password, existingUser.password); 
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }
            const token = jwt.sign({ userid: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });


            res.json({ success: true, message: "Login successful", user: existingUser ,auth:token});
        } catch (error) {
            console.log("Error occurred: " + error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    })
module.exports = router;