const User = require("../models/user.model");
const tokenBlacklist = require("../models/tokenBlacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @route POST /api/auth/register
 * @desc Controller for registering a new user
 * @body {string} username - The username of the new user
 * @body {string} email - The email of the new user
 * @body {string} password - The password of the new user
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    // Extracting the username, email, and password from the request body
    const { username, email, password } = req.body;

    // Validating the input fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Checking if a user with the same email or username already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // if a user with the same email or username already exists, return a 400 Bad Request response with an error message
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }

    // Hashing the password using bcryptjs
    const hash = await bcrypt.hash(password, 10);

    // Creating a new user instance with the provided username, email, and hashed password
    let user;
    try {
      user = await User.create({ username, email, password: hash });
    } catch (error) {
      return res.status(500).json({ message: "Error creating user in the database", error });
    }

    // Creating a JWT token for the newly registered user
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Setting the JWT token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Cookie is only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Cookie is only sent over HTTPS in production
      sameSite: 'strict', // Cookie is not sent with cross-site requests
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 1 day
    });

    // Returning the user data and the JWT token
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while registering the user" });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Controller for logging in a user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    // Exctracting the email and password from the request body
    const { email, password } = req.body;

    // Validating the input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    // Finding a user in the database with the provided email
    const user = await User.findOne({ email });

    // If no user is found with the provided email, return a 400 Bad Request response with an error message
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Checking for valid password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Creating a JWT token for the logged-in user
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Setting the JWT token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Cookie is only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Cookie is only sent over HTTPS in production
      sameSite: 'strict', // Cookie is not sent with cross-site requests
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 1 day
    });

    // Returning the user data and the JWT token
    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while logging in the user" });
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Controller for logging out a user
 * @access Private (requires authentication)
 */
const logoutUser = async (req, res) => {
  try {

    // Blacklist the token
    const token = req.cookies.token;
    await tokenBlacklist.create({ token });

    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true, // Cookie is only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Cookie is only sent over HTTPS in production
      sameSite: 'strict', // Cookie is not sent with cross-site requests
    });

    // Return a success response
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error while logging out the user" });
  }
}

/**
 * @route GET /api/auth/get-user
 * @desc Controller for fetching the current user's information
 * @access Private (requires authentication)
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log('Error while fetching the user', error);
    res.status(500).json({message: "Internal server error while fetching the user"})
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser
};
