const express = require('express');
const router = express.Router();
const Order = require('../models/Orderdata');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'check8737496@gmail.com', // replace with your email
    pass: 'odnp gdjo tsbw vusv',    // replace with your email password
  },
});

// Function to generate a unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
};

// Function to calculate total price with GST
const calculateTotalWithGST = (cart, gstRate = 0.02) => {
  let totalPrice = cart.reduce((total, food) => total + food.price * food.quantity, 0);
  let gst = (totalPrice * gstRate).toFixed(2);
  let subtotal = (totalPrice + parseFloat(gst)).toFixed(2);
  return { totalPrice, gst, subtotal };
}

router.post('/orderdata', async (req, res) => {
  const { email, orderdata } = req.body;
  const orderNumber = generateOrderNumber();

  // Calculate totals
  let { totalPrice, gst, subtotal } = calculateTotalWithGST(orderdata);

  try {
    // Check if the order already exists
    let existingOrder = await Order.findOne({ email });

    if (!existingOrder) {
      // Create a new order
      const newOrder = new Order({
        email,
        orderdata: [{ orderNumber, items: orderdata }]
      });
      await newOrder.save();
    } else {
      // Update the existing order without nesting arrays
      existingOrder.orderdata.push({ orderNumber, items: orderdata,date:Date.now() });
      await existingOrder.save();
    }

    // Email template with CSS and order number, item details
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Thank You for Your Order!</h2>
        <p style="font-size: 16px; color: #555;">Your order number is <strong>${orderNumber}</strong>.</p>
        <h3 style="color: #333;">Order Details:</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderdata.map(item => `
            <li style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #ddd;">
              <div style="display: flex; align-items: center;">
                <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                <div>
                  <p style="margin: 0; font-size: 16px; color: #333;"><strong>${item.name}</strong></p>
                  <p style="margin: 0; font-size: 14px; color: #777;">Quantity: ${item.quantity}</p>
                  <p style="margin: 0; font-size: 14px; color: #777;">Total Price: ${item.totalprice}</p>
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
        <p style="font-size: 18px; color:#333;">Total: ${totalPrice}</p>
        <p style="font-size: 18px; color:#333;">GST 2%: ${gst}</p>
        <p style="font-size: 20px; color:#FF0000;  background-color: black ; padding: 5px 10px;">Subtotal: ${subtotal}</p>
        <p style="font-size: 16px; color: #555;">Your order will be at your doorstep in 45 minutes.</p>
        <p style="font-size: 16px; color: #555;">Thanks,</p>
        <p style="font-size: 16px; color: #555;">The Team</p>
        <p style="font-size: 16px; color: #555;">ZD_Food</p>
      </div>
    `;

    // Send order confirmation email
    await transporter.sendMail({
      from: 'check8737496@gmail.com',
      to: email,
      subject: 'Order Confirmation - ZD_Food',
      html: htmlEmail,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ servererror: error.message });
  }
});

module.exports = router;
