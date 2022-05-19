const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

// Imported Routes
const userRoute = require("./routes/user");
const postRoute = require("./routes/posts");

// MongoDB Connection

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to Mongo");
});




// Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

let auth = require('./auth')(app);

// API End-Points

// User Routes
app.use('/tether', userRoute);

app.use('/tether/timeline', postRoute);


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log("Listening on port " + port);
})