const mongoose = require('mongoose'); // Importing the Mongoose library for MongoDB interactions

// Defining the schema for the token blacklist
const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adding timestamps to the schema to track when tokens are blacklisted

tokenBlacklistSchema.index({ token: 1 }, {expireAfterSeconds: 60*60*24*3}); // Creating an index on the token field for faster lookups and setting an expiration time of 3 days for blacklisted tokens

// Creating the model for the token blacklist using the defined schema
const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist; // Exporting the TokenBlacklist model for use in other parts of the application