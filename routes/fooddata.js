const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
router.get('/fooddata',  async (req, res) => {
    try {
        
  
    const fetched_data= mongoose.connection.db.collection("food_data");
    const food_data=await fetched_data.find({}).toArray()
    const foodcatagory= mongoose.connection.db.collection("foodcatagory_data");
    const foodcatagory_data=await foodcatagory.find({}).toArray()
    
   return res.json({ success: true, food_data: food_data,foodcatagory:foodcatagory_data});
  } 
    catch (error) {
        console.log("Error occurred: " + error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})

module.exports = router;