const express = require('express');
const router = express.Router();
const user = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const EMAIL_SECRET = 'verify yourself!'; // separate secret for email tokens

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use 587 for TLS
  secure: true, // Use true for 465, false for other ports
  auth: {
    user: 'check8737496@gmail.com', // replace with your email
    pass: 'odnp gdjo tsbw vusv',  // replace with your email password
  },
});

router.post(
  '/createuser',
  // username must be an email
  body('email', 'please input correct email').isEmail(),
  //name
  body('name', 'please input authentic name').isLength({ min: 5 }),
  // password must be at least 5 chars long
  body('password', 'please input authentic password').isLength({ min: 5 }),
  //location
  body('location', 'input your location').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "please input valid data" });
    }
    const { name, password, email, location } = req.body;
    try {
      // Check if the email already exists
      const existingUser = await user.findOne({ email: email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already in use' });
      }
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const verificationToken = jwt.sign({ email }, EMAIL_SECRET, { expiresIn: '1d' });
      const data = await user.create({
        name: name,
        password: hashedPassword,
        email: email,
        location: location,
        isVerified: false,
      });
      await data.save();

      const verificationUrl = `http://localhost:5000/api/verifyuser/${verificationToken}`;

      // Email template with CSS
      const htmlEmail = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
         <h2 style="color: #333;">Welcome to Our Service</h2>
         <p style="font-size: 16px; color: #555;">Hi ${name},</p>
         <p style="font-size: 16px; color: #555;">Thank you for registering. Please verify your email address by clicking the link below:</p>
         <div style="text-align: center; margin: 20px 0;">
           <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
         </div>
         <p style="font-size: 16px; color: #555;">If you didn't request this, please ignore this email.</p>
         <p style="font-size: 16px; color: #555;">Thanks,</p>
         <p style="font-size: 16px; color: #555;">The Team</p>
         <p style="font-size: 16px; color: #555;">ZD_Food</p>

       </div>
     `;

      // Send verification email
      await transporter.sendMail({
        from: 'your_email@gmail.com', // ensure this matches your email
        to: email,
        subject: 'Verify your email',
        html: htmlEmail,
      });

      res.json({ success: true, message: 'User created. Please verify your email now.' });

    } catch (error) {
      console.log('Error occurred: ' + error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);
module.exports = router;
