require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || "mongodb+srv://zaryabdogar23:dogar1234@cluster0.8xpxs3y.mongodb.net/zdfood?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('MongoDB connection failed');
  }
};

module.exports = connectToMongo;
