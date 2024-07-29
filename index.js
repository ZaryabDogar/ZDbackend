const cors = require('cors');
const express = require('express');
const connectToMongo = require('./db');
const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to the database
    await connectToMongo();

    // Use the CORS middleware
    app.use(cors());

    // Middleware
    app.use(express.json());

    // Define routes
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.use('/api', require('./routes/fooddata'));
    app.use('/api', require('./routes/createuser'));
    app.use('/api', require('./routes/loginuser'));
    app.use('/api', require('./routes/verifyuser'));
    app.use('/api', require('./routes/forgetpass'));
    app.use('/api', require('./routes/resetpassword'));

    // Start the server
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
