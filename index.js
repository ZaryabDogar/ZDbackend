const cors = require('cors');
const connectToMongo = require('./db');   
const express = require('express')
const app = express()
const port = 5000
//connect to database
connectToMongo();
//cors policy
// Use the CORS middleware
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//middle ware
app.use(express.json())
app.use("/api",require('./routes/createuser'))
app.use("/api",require('./routes/loginuser'))
app.use("/api",require('./routes/verifyuser'))
app.use("/api",require('./routes/forgetpass'))
app.use("/api",require('./routes/resetpassword'))
app.use("/api",require('./routes/fooddata'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
