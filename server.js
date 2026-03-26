require('dotenv').config(); // Importing the dotenv package to load environment variables from a .env file

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Setting custom DNS servers to avoid potential DNS resolution issues

const app = require('./src/app'); // Importing the Express app

const connectDB = require('./src/db/db'); // Importing the function to connect to MongoDB
connectDB(); // Establishing a connection to the MongoDB database

const PORT = process.env.PORT || 3000; // Defining the port on which the server will listen

// Starting the server and listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});