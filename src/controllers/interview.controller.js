const InterviewReport = require("../models/interviewReport.model");
const ai = require("../services/ai.service");
const pdfParse = require("pdf-parse");

/**
 * Controller to handle interview report generation
 * Expects a multipart/form-data request with:
 * - resume: PDF file upload
 * - jobDescription: String
 * - selfDescription: String (optional)
 */
const generateInterviewReportController = async (req, res) => {
    try {
        const resume = req.file; // resume is uploaded as a file
        const resumeText = await (new pdfParse.PDFParse(Uint8Array.from(resume.buffer))).getText();
        const { jobDescription, selfDescription } = req.body;

        const aiResponse = await ai.generateInterviewReport(resumeText.text, selfDescription, jobDescription);

        const interviewReport = await InterviewReport.create({
            user: req.user.id,
            jobDescription,
            resumeText: resumeText.text,
            selfDescription,
            ...aiResponse,
        })

        res.status(200).json({ message: "Interview report generated successfully", interviewReport });

    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ error: "Internal server error while generating interview report" });
    }
}

/**
 * Controller to fetch a previously generated interview report by its ID
 * Expects the interview report ID as a URL parameter
 */
const getInterviewReportController = async (req, res) => {
    try {
        const { interviewId } = req.params;

        const interviewReport = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ error: "Interview report not found" });
        }

        res.status(200).json({ message: "Interview report fetched successfully", interviewReport });

    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ error: "Internal server error while fetching interview report" });
    }
}

const getAllReportsForUserController = async (req, res) => {
    try {
        const userId = req.user.id;

        if (userId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access to interview reports" });
        }

        const interviewReports = await InterviewReport.find({ user: userId }).sort({ createdAt: -1 }).lean().select("-resumeText -selfDescription -jobDescription -__v -TechnicalQuestions -BehavioralQuestions -SkillGaps -PreparationPlan -OverallFeedback");

        res.status(200).json({ message: "Interview reports fetched successfully", interviewReports });

    } catch (error) {
        console.error("Error fetching interview reports for user:", error);
        res.status(500).json({ error: "Internal server error while fetching interview reports for user" });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllReportsForUserController
};