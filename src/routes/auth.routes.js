const { Router } = require('express');

const authRouter = Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private (requires authentication)
 */
authRouter.post('/logout', authMiddleware.authUser, authController.logoutUser);

/**
 * @route GET /api/auth/get-user
 * @desc Fetch the current user's information
 * @access Private (requires authentication)
 */
authRouter.get('/get-user', authMiddleware.authUser, authController.getUser);
module.exports = authRouter;