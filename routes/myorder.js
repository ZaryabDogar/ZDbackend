const express = require('express');
const router = express.Router();
const Order = require('../models/Orderdata');

router.post('/myorder', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        let orderRecord = await Order.findOne({ email });
        if (!orderRecord) {
            return res.status(404).json({ success: false, message: "No orders found for this email" });
        }

        res.json({ success: true, mydata: orderRecord.orderdata });
    } catch (error) {
        res.send(500).json({ servererror: error.message });
    }
});

module.exports = router;
