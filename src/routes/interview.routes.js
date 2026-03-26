const {Router} = require("express");
const interviewController = require("../controllers/interview.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

const interviewRouter = Router();

/**
 * @route POST /api/interview
 * @desc Generate an interview report based on the provided job description and resume text
 * @access Private
 * @body { jobDescription: String, resumeText: pdf->text, selfDescription: String (optional) }
 * @returns { matchScore: Number, technicalQuestions: Array, behavioralQuestions: Array, skillGaps: Array, preparationPlan: Array, overallFeedback: String }
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get a previously generated interview report by its ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportController);

/**
 * @route GET /api/interview/reports/user/:userId
 * @desc Get all interview reports for a specific user
 * @access Private
 */
interviewRouter.get('/reports', authMiddleware.authUser, interviewController.getAllReportsForUserController);

module.exports = interviewRouter;