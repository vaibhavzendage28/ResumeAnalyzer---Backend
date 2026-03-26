const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    )
    .describe(
      "A higher score indicates a better match, while a lower score indicates a poorer match",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked during the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the technical question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer the technical question effectively, including key points to cover and common pitfalls to avoid",
          ),
      }),
    )
    .describe(
      "A list of technical questions that may be asked during the interview, along with the interviewer's intention and guidance on how to answer them effectively",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked during the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the behavioral question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer the behavioral question effectively, including key points to cover and common pitfalls to avoid",
          ),
      }),
    )
    .describe(
      "A list of behavioral questions that may be asked during the interview, along with the interviewer's intention and guidance on how to answer them effectively",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that is identified as a gap"),
        description: z
          .string()
          .describe("A description of the skill gap and its impact"),
      }),
    )
    .describe("A list of skill gaps identified in the candidate's profile"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan"),
        focus: z.string().describe("The main focus or topic for that day"),
        tasks: z
          .array(z.string())
          .describe(
            "A list of specific tasks or activities to be completed on that day",
          ),
      }),
    )
    .describe("A list of preparation steps for the interview"),
  overallFeedback: z
    .string()
    .describe(
      "Overall feedback on the candidate's suitability for the job and areas for improvement",
    )
    .describe(
      "Overall feedback on the candidate's suitability for the job and areas for improvement",
    ),
});

// helper function to attempt structured repair of AI response

function parseFlatQAArray(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    if (
      arr[i] === "question" &&
      arr[i + 2] === "intention" &&
      arr[i + 4] === "answer"
    ) {
      result.push({
        question: arr[i + 1] || "",
        intention: arr[i + 3] || "",
        answer: arr[i + 5] || "",
      });
    }
  }

  return result;
}

function parseSkillGaps(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 4) {
    if (arr[i] === "skill" && arr[i + 2] === "description") {
      result.push({
        skill: arr[i + 1] || "",
        description: arr[i + 3] || "",
      });
    }
  }

  return result;
}

function parsePrepPlan(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    if (arr[i] === "day" && arr[i + 2] === "focus" && arr[i + 4] === "tasks") {
      result.push({
        day: arr[i + 1] || 0,
        focus: arr[i + 3] || "",
        tasks: [arr[i + 5]].flat(),
      });
    }
  }

  return result;
}

function repairWeirdResponse(data) {
  return {
    matchScore: data.matchScore || 0,
    technicalQuestions: parseFlatQAArray(data.technicalQuestions || []),
    behavioralQuestions: parseFlatQAArray(data.behavioralQuestions || []),
    skillGaps: parseSkillGaps(data.skillGaps || []),
    preparationPlan: parsePrepPlan(data.preparationPlan || []),
    overallFeedback: data.overallFeedback || "",
  };
}

function extractJobRole(jobDescription) {
  const roles = [
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Software Engineer",
    "Software Developer",
    "MERN Stack Developer"
  ];

  for (const role of roles) {
    if (jobDescription.toLowerCase().includes(role.toLowerCase())) {
      return role;
    }
  }

  return "Software Developer"; // fallback
}

// main function to generate interview report using AI

const generateInterviewReport = async (
  resumeText,
  selfDescription,
  jobDescription,
) => {
  try {
    const prompt = `
Generate JSON EXACTLY in this structure:

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Example question",
      "intention": "Why interviewer asks this",
      "answer": "How to answer"
    },
    {
      "question": "Example question",
      "intention": "Why interviewer asks this",
      "answer": "How to answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Example question",
      "intention": "Why interviewer asks this",
      "answer": "How to answer"
    },
    {
      "question": "Example question",
      "intention": "Why interviewer asks this",
      "answer": "How to answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "description": "Lack of experience in scalable architecture"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "System Design",
      "tasks": ["Study load balancing", "Learn caching"]
    }
  ],
  "overallFeedback": "string"
}

STRICT RULES:
- Generate AT LEAST 5 technicalQuestions
- Generate AT LEAST 5 behavioralQuestions
- Generate AT LEAST 3 skillGaps
- Generate AT LEAST 4 preparationPlan days
- Do NOT return strings where objects are required
- Do NOT simplify arrays
- Do NOT return fewer items than required
- Every item must follow object structure exactly
- Output ONLY JSON

Now generate:

Resume: ${resumeText}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
        temperature: 0, // for deterministic output, set temperature to 0
      },
    });

    let parsed = JSON.parse(response.text);

    // Try normal validation
    let result = interviewReportSchema.safeParse(parsed);

    if (!result.success) {
      console.log("⚠️ Attempting structured repair...");

      parsed = repairWeirdResponse(parsed);
      result = interviewReportSchema.safeParse(parsed);

      if (!result.success) {
        throw new Error("Unrecoverable AI response");
      }
    }
    const jobRole = extractJobRole(jobDescription);
    const data = result.data;
    const title = `Interview Report - ${jobRole} (${data.matchScore}%)`;
    const finalReport = {
      title,
      ...data,
    };
    return finalReport;
  } catch (error) {
    console.error("Error generating interview report:", error);
    throw new Error("Failed to generate interview report");
  }
};

module.exports = {
  generateInterviewReport,
};
