const User = require('../models/user.model'); // Importing the User model
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken library for handling JWT tokens
const tokenBlacklist = require('../models/tokenBlacklist.model'); // Importing the TokenBlacklist model for handling blacklisted tokens

const authUser = async (req, res, next) => {
    try {
        // Extracting the token from the cookies
        const token = req.cookies.token;

        // If no token is found, return a 401 Unauthorized response
        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await tokenBlacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is invalid" });
        }

        // Verifying the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Finding the user in the database using the ID from the decoded token
        const user = await User.findById(decoded.id).select("-password"); // Excluding the password field from the user data

        // If no user is found, return a 401 Unauthorized response
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }
        // Attaching the user data to the request object for use in subsequent middleware or route handlers
        req.user = user;
        next(); // Calling the next middleware or route handler
    } catch (error) {
        console.log("Error in auth middleware:", error);
        res.status(500).json({ message: "Internal server error while authenticating the user" });
    }
}

module.exports = {
    authUser,
}