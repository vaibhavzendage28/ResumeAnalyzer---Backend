# Resume Analyzer - Backend

> AI-powered backend service for intelligent interview preparation through resume analysis

## 🎯 Overview

The Resume Analyzer backend is a robust Node.js API that leverages Google GenAI to analyze resumes against job descriptions and generate comprehensive interview preparation reports. It handles user authentication, PDF processing, AI-driven analysis, and persistent report storage.

## ✨ Key Features

- **AI-Powered Analysis** - Uses Google Gemini AI to generate intelligent interview questions and feedback
- **PDF Processing** - Extracts and parses resume text from PDF files
- **JWT Authentication** - Secure user authentication with token-based access control
- **Token Blacklist System** - Prevents unauthorized access with logout functionality
- **MongoDB Integration** - Scalable NoSQL database for user and report storage
- **Input Validation** - Zod schema validation for request data integrity
- **CORS Enabled** - Supports cross-origin requests from frontend applications

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **AI Integration**: Google GenAI (@google/genai)
- **File Processing**: Multer + PDF-Parse
- **Validation**: Zod + Zod-to-JSON-Schema
- **Utilities**: Cookie-parser, CORS, Dotenv

## 📋 Project Structure

```
Backend/
├── src/
│   ├── app.js                 # Express app setup & middleware
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── routes/               # API endpoint definitions
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   ├── models/               # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── interviewReport.model.js
│   │   └── tokenBlacklist.model.js
│   ├── services/             # Business logic
│   │   └── ai.service.js     # Google GenAI integration
│   ├── middlewares/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   └── db/                   # Database connection
│       └── connect.js
├── server.js                 # Application entry point
├── package.json
└── .env                      # Environment variables

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Google GenAI API key

### Installation

1. **Clone & Navigate**

   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the Backend directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   JWT_SECRET=your_secure_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   NODE_ENV=development
   ```

3. **Start the Server**

   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description                        |
| ------ | ----------- | ---------------------------------- |
| POST   | `/register` | Create new user account            |
| POST   | `/login`    | Authenticate and receive JWT token |
| POST   | `/logout`   | Invalidate current token           |

### Interview Routes (`/api/interview`)

| Method | Endpoint       | Description                                             |
| ------ | -------------- | ------------------------------------------------------- |
| POST   | `/generate`    | Generate interview report from resume & job description |
| GET    | `/reports`     | Retrieve all user's interview reports                   |
| GET    | `/reports/:id` | Get specific interview report                           |
| DELETE | `/reports/:id` | Delete an interview report                              |

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for secure authentication:

1. **Register/Login**: Obtain JWT token from authentication endpoints
2. **Protected Routes**: Include token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Blacklist**: Logout invalidates tokens for security

## 🤖 AI Analysis Features

The `/generate` endpoint produces comprehensive reports including:

- **Match Score**: Percentage alignment between resume and job requirements
- **Technical Questions**: Role-specific interview questions with:
  - Question content
  - Interviewer's intention
  - Expected answer outline
- **Behavioral Questions**: Soft skills assessment questions
- **Skill Gaps**: Areas requiring improvement
- **Preparation Plan**: Actionable guidance for interview success
- **Overall Feedback**: Comprehensive assessment and recommendations

## 📊 Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Interview Report Model

```javascript
{
  userId: ObjectId (ref: User),
  matchScore: Number,
  technicalQuestions: Array,
  behavioralQuestions: Array,
  skillGaps: Array,
  preparationPlan: String,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Token-based stateless authentication
- **Token Blacklist**: Prevents unauthorized access after logout
- **Input Validation**: Zod schema validation prevents malicious input
- **CORS Protection**: Restricted to trusted origins
- **PDF Validation**: Safe file upload handling with Multer

## 🧪 Testing

Currently, test framework is not configured. To add tests:

```bash
npm install --save-dev jest supertest
npm test
```

## 📝 Environment Variables

| Variable             | Description                | Example                                   |
| -------------------- | -------------------------- | ----------------------------------------- |
| PORT                 | Server port                | 3000                                      |
| MONGODB_URI          | MongoDB connection string  | mongodb://localhost:27017/resume-analyzer |
| JWT_SECRET           | Secret key for JWT signing | your_secret_key_min_32_chars              |
| GOOGLE_GENAI_API_KEY | Google GenAI API key       | api_key_here                              |
| NODE_ENV             | Environment mode           | development/production                    |

## 🐛 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🔄 Development Workflow

1. **Watch Mode**: `npm run dev` with Nodemon auto-restarts on file changes
2. **Code Style**: Follows Express.js conventions
3. **Modular Structure**: Each feature (auth, interview) has isolated controllers, routes, and services
4. **Middleware Pipeline**: Request flows through validation → authentication → handler → response

## 📦 Deployment

### Live Deployment

The backend is live and deployed on **Render**:

🔗 **API URL**: https://resumeanalyzer-backend-lpjc.onrender.com

**Available Endpoints:**

- Authentication: `https://resumeanalyzer-backend-lpjc.onrender.com/api/auth`
- Interview Reports: `https://resumeanalyzer-backend-lpjc.onrender.com/api/interview`

### Deployment Instructions

For production deployment:

1. Set `NODE_ENV=production`
2. Use production MongoDB instance
3. Generate secure JWT_SECRET
4. Configure Google GenAI API credentials
5. Deploy using:
   - Docker containers
   - Render, Vercel, Heroku, AWS, or similar cloud platforms
   - Dedicated Node.js hosting

## 🤝 Contributing

When contributing to the backend:

1. Follow the existing project structure
2. Validate all inputs with Zod schemas
3. Use meaningful commit messages
4. Test API endpoints before submitting changes

## 📄 License

This project is licensed under the ISC License.

## 💡 Future Enhancements

- [ ] Rate limiting for API endpoints
- [ ] Caching layer for frequently accessed reports
- [ ] Email notifications for interview preparation milestones
- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Advanced analytics dashboard
- [ ] Interview simulation with video recording

## 👤 Author

**Vaibhav Zendage**

---

**Built with ❤️ for career success**
