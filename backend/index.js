const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());

const route = require('./routes/route.js');
app.use('/admin', route);

mongoose.connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB ", err);
  
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
