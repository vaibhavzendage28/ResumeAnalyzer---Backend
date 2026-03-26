const mongoose = require('mongoose');

const technicalQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: [ true, "Question is required" ] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
}, { _id: false });

const behavioralQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: [ true, "Question is required" ] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
}, { _id: false });

const skillGapsSchema = new mongoose.Schema({
    skill: { type: String, required: [ true, "Skill is required" ] },
    need: {
        type: String,
        enum: ["low", "medium", "high"],
    },
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: [ true, "Day is required" ] },
    focus: { type: String, required: [ true, "Focus is required" ] },
    tasks: [{ type: String, required: [ true, "At least one task is required" ] }],
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, "User reference is required" ],
    },
    jobDescription: { 
        type: String,
        required: [ true, "Job description is required" ],
    },
    resumeText: {
        type: String,
        required: [ true, "Resume text is required" ],
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: [ 0, "Match score cannot be less than 0" ],
        max: [ 100, "Match score cannot be greater than 100" ],
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    overallFeedback: {
        type: String,
    },
    title: {
        type: String,
        required: [ true, "Report title is required" ],
    },
}, { timestamps: true });
    

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReport;