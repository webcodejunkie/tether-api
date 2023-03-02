const express = require("express"),
	app = express(),
	server = require("http").createServer(app);

// Cors Policy
let allowedOrigins = ['http://localhost:1234', 'http://localhost:3000', 'https://webcodejunkie.github.io'];
const io = require("socket.io")(server, {
	cors: {
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				let message = 'The CORS policy for this application does not allow access from origin' + origin;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		}
	}
});

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Cors Policy
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

require("dotenv").config();
// Imported Routes
const userRoute = require('./routes/user');
const communityRoute = require('./routes/community');
const imageRoute = require('./routes/image');
const postRoute = require('./routes/post');
// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false }, () => {
	console.log("Connected to Mongo");
});

// Socket.IO Connection
io.on('connection', (socket) => {
	console.log(`'${socket.id} user just connected'`);
	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

// Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static(__dirname + '/uploads'));

let auth = require('./auth')(app);

require('./passport');

// API End-Points

app.get('/', (req, res) => {
	res.status(200).send('Welcome to tether!');
});

// User Routes
app.use('/tether', userRoute);

// Community Routes
app.use('/tether/community', communityRoute);

// Image Routes
app.use('/tether/media', imageRoute);

// Post Routes
app.use('/posts', postRoute);

const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
	console.log("Listening on port " + port);
});

//app.listen(port, '0.0.0.0', () => {
//  console.log("Listening on port " + port);
//});