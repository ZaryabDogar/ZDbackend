require('dotenv').config();


const mongouri = process.env.MONGO_URI


const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });

    console.log('Connected to MongoDB successfully');
    const fetched_data= mongoose.connection.db.collection("food_data");
    const data=await fetched_data.find({}).toArray()
    // console.log(data);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongo;
