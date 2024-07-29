const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const JWT_SECRET = 'dont know vcbvbnvbnv';
const user = require('../models/User')
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 587 for TLS
    secure: true, // Use true for 465, false for other ports
    auth: {
      user: 'check8737496@gmail.com', // replace with your email
      pass: 'odnp gdjo tsbw vusv',  // replace with your email password
    },
  });

router.post('/forgetpass', async (req, res) => {
  const { email } = req.body;
  const User = await user.findOne({ email });
  try {
    if(!User)
    {
      res.status(500).json({ success: false, message: 'cant find your email' });
    }
    else{
    // Generate JWT token
    const token = jwt.sign({ email },  JWT_SECRET,{ expiresIn: '1h' });

    const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Welcome to Our Service</h2>
      <p style="font-size: 16px; color: #555;">Hi ${User.name},</p>
      <p style="font-size: 16px; color: #555;">You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href=" http://localhost:3000/resetpassword/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </div>
      <p style="font-size: 16px; color: #555;">   If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p style="font-size: 16px; color: #555;">Thanks,</p>
      <p style="font-size: 16px; color: #555;">The Team</p>
      <p style="font-size: 16px; color: #555;">ZD_Food</p>

    </div>
  `;
    // Send reset password email
    const mailOptions = {
      to: email,
      from: 'check8737496@gmail.com',
      subject: 'Password Reset',
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Email sending failed' });
      }
      res.json({ success: true, message: 'Password reset email sent' });
    });}
  } catch (error) {
    console.log("Error occurred: " + error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
