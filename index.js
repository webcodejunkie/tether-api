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
const communityRoute = require('./routes/community');

// MongoDB Connection

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to Mongo");
});


// Cors Policy
let allowedOrigins = ['http://localhost:1234', 'http://localhost:3000', 'https://webcodejunkie.github.io'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application does not allow access from origin' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));




// Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static(__dirname + '/uploads'));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// API End-Points

// User Routes
app.use('/tether', userRoute);

// Community Routes
app.use('/tether/community', communityRoute);


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log("Listening on port " + port);
})
