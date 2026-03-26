const express = require('express'); // Importing the Express library
const cookieParser = require('cookie-parser'); // Importing the cookie-parser middleware
const cors = require('cors'); // Importing the CORS middleware

const app = express(); // Creating an Express application

// Common Middlewares
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
    origin: "https://resume-analyzer-frontend-six-ivory.vercel.app", // Allowing requests from this origin
    credentials: true, // Allowing cookies to be sent with requests
}))

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Importing and using the authentication routes
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

// Importing and using the interview report routes
const interviewRouter = require('./routes/interview.routes');
app.use('/api/interview', interviewRouter);

// Exporting the app for use in other files (like server.js)
module.exports = app;