# 🎯 AspireLens - AI-Powered Career Intelligence Platform

**Smart career discovery through data-driven aptitude assessment and personalized AI guidance**

AspireLens transforms career counselling from generic advice to precise, data-backed recommendations. By combining timed aptitude evaluations with backend-scored analytics and AI-generated insights, we provide students with objective career direction based on their actual performance strengths and weaknesses.

---

## 🚀 Why AspireLens?

Traditional career guidance often relies on subjective assessments and generic advice. AspireLens solves this by:

- **Eliminating bias** through standardized, timed aptitude tests
- **Ensuring integrity** with backend-enforced scoring and validation
- **Providing personalized insights** derived directly from performance data
- **Maintaining question uniqueness** - no user ever sees the same question twice
- **Offering actionable intelligence** instead of vague suggestions

Our system treats career discovery as an engineering problem, applying data validation, AI reasoning, and secure architecture to deliver reliable guidance.

---

## 🧠 Core Features

### 🧪 Intelligent Test System
- **Timed, Non-resumable Assessments**: Maintains test integrity with enforced time limits
- **Multi-Section Evaluation**: Logical, Verbal, Creativity, and Personality dimensions
- **Backend-Controlled Integrity**: Scoring and validation happen server-side only
- **Zero Question Repetition**: Unique question sets per user, guaranteed by backend logic
- **Real-time Progress Tracking**: Monitor completion status without compromising security

### 🤖 AI Career Counselling Engine
- **Performance-Based Analysis**: AI recommendations generated exclusively from test results
- **Section-Wise Strength Mapping**: Identifies natural aptitudes across different cognitive domains
- **Data-Driven Insights**: No generic advice—every suggestion ties directly to performance metrics
- **JSON-Safe Output Validation**: Structured, validated AI responses ensuring system compatibility
- **Continuous Learning**: AI models refine recommendations based on aggregated anonymized data

### 🧭 Personalized Career Direction
- **Match Percentage Scoring**: Quantitative career suitability ratings
- **Skill Gap Identification**: Specific areas for improvement with actionable steps
- **Learning Focus Areas**: Prioritized skill development recommendations
- **Education Pathway Mapping**: Suggested academic routes aligned with career goals
- **Future-Proof Planning**: Adaptable recommendations considering evolving job markets

### 🔐 Authentication & Security
- **JWT-Based Access Control**: Secure token management with automatic refresh
- **Email Verification**: Mandatory account confirmation for data integrity
- **Role-Based Permissions**: Separate access levels for students and administrators
- **Encrypted Data Transmission**: All communications protected via HTTPS/TLS
- **Session Management**: Secure handling of active sessions with timeout protection

### 🧑‍💼 Admin Control System
- **Question Management**: Add, moderate, and categorize assessment questions
- **AI Oversight Dashboard**: Monitor and fine-tune recommendation accuracy
- **User Analytics**: Performance trends and platform usage statistics
- **Role Management**: Granular permission controls for administrative staff
- **Content Moderation**: Ensure assessment quality and appropriateness

---

## ⚙️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for consistent iconography

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Email Service**: Nodemailer for verification and notifications
- **Validation**: Joi for request schema validation
- **Security**: Helmet.js, CORS, rate limiting

### **AI Integration**
- **Provider**: Groq with LLaMA 3.x models
- **Architecture**: Service-based AI processing layer
- **Output**: Structured JSON responses with validation
- **Caching**: Performance-optimized response caching

### **Development & Deployment**
- **Package Manager**: npm/yarn
- **Version Control**: Git with GitHub
- **Frontend Hosting**: Vercel / Netlify
- **Backend Hosting**: Render / Railway
- **Database Hosting**: MongoDB Atlas
- **Environment Management**: Dotenv with validation

---

## 🏗️ System Architecture Overview

AspireLens follows a **backend-as-source-of-truth** architecture:
Frontend (React/Vite) → Backend API (Express/Node) → Database (MongoDB) → AI Service (Groq)
↑ ↑ ↑ ↑
Validation Business Logic Data Persistence Intelligence Layer


### **Key Architectural Principles:**
1. **Backend Control**: All scoring, validation, and business logic occurs server-side
2. **Stateless Frontend**: UI components render data but don't process critical logic
3. **Layered Security**: Multiple validation points from user input to AI output
4. **AI Fallback System**: Graceful degradation when external services are unavailable
5. **Data Integrity First**: Every user action triggers validation before processing

### **Test Lifecycle:**
1. Question retrieval with uniqueness guarantees
2. Timed session management
3. Backend-only scoring computation
4. Performance analytics generation
5. AI recommendation processing
6. Result storage with integrity checks

---

## 📡 API Overview

### **Authentication Module**
- User registration with email verification
- Secure login with JWT issuance
- Token refresh and validation
- Password reset functionality

### **Test Management Module**
- Unique question set generation per user
- Timed test session handling
- Response submission with validation
- Progress tracking and state management

### **Results & Analytics Module**
- Backend scoring computation
- Performance metric calculation
- Historical result retrieval
- Comparative analytics (when permitted)

### **AI Counselling Module**
- Performance data preprocessing
- AI recommendation generation
- Structured output validation
- Recommendation storage and retrieval

### **Admin Management Module**
- User management and moderation
- Question bank administration
- System analytics and reporting
- AI model performance monitoring

---

# 📁 PROJECT STRUCTURE 

```bash
.
|-- README.md
|-- aspirelens-backend
|   |-- package-lock.json
|   |-- package.json
|   `-- src
|       |-- config
|       |   |-- db.js
|       |   `-- passport.js
|       |-- controllers
|       |   |-- adminAuthController.js
|       |   |-- adminController.js
|       |   |-- authController.js
|       |   |-- testController.js
|       |   |-- tests
|       |   `-- userController.js
|       |-- middleware
|       |   |-- adminAuth.js
|       |   |-- adminMiddleware.js
|       |   |-- authMiddleware.js
|       |   `-- profileMiddleware.js
|       |-- migration.js
|       |-- models
|       |   |-- Career.js
|       |   |-- Question.js
|       |   |-- TestResults.js
|       |   |-- TestSessions.js
|       |   |-- User.js
|       |   |-- UserActivity.js
|       |   |-- UserAnswer.js
|       |   `-- index.js
|       |-- routes
|       |   |-- adminAuthRoutes.js
|       |   |-- adminRoutes.js
|       |   |-- aiRoutes.js
|       |   |-- authRoutes.js
|       |   |-- counsellingRoutes.js
|       |   |-- dashboard.js
|       |   |-- testRoutes.js
|       |   `-- userRoutes.js
|       |-- server.js
|       |-- services
|       |   |-- openaiService.js
|       |   `-- questionService.js
|       `-- utils
|           |-- levelCalculator.js
|           |-- sendEmail.js
|           `-- updateActivity.js
|-- aspirelens-frontend
|   |-- README.md
|   |-- eslint.config.js
|   |-- index.html
|   |-- package-lock.json
|   |-- package.json
|   |-- public
|   |   |-- aspirelens-logo.png
|   |   `-- aspirelens-logo2.png
|   |-- src
|   |   |-- App.jsx
|   |   |-- Json-Animation
|   |   |   |-- AdminAuth.json
|   |   |   |-- Dashboard_screen.json
|   |   |   |-- Login.json
|   |   |   |-- SighUp.json
|   |   |   `-- success.json
|   |   |-- assets
|   |   |   |-- aspirelens-logo.png
|   |   |   `-- aspirelens-logo2.png
|   |   |-- components
|   |   |   |-- AdminAuthGuard.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   `-- admin
|   |   |-- context
|   |   |   |-- AuthContext.jsx
|   |   |   |-- AuthProvider.jsx
|   |   |   `-- ThemeContext.jsx
|   |   |-- layouts
|   |   |   `-- AdminLayout.jsx
|   |   |-- main.jsx
|   |   `-- pages
|   |       |-- AboutUs.jsx
|   |       |-- AdminDashboard.jsx
|   |       |-- AdminLogin.jsx
|   |       |-- CareerCounselling.jsx
|   |       |-- Dashboard.jsx
|   |       |-- HeroHome.jsx
|   |       |-- HeroSection.jsx
|   |       |-- Login.jsx
|   |       |-- MyProfile.jsx
|   |       |-- SignUp.jsx
|   |       |-- StartTest.jsx
|   |       |-- TestResult.jsx
|   |       |-- TestRunner.jsx
|   |       |-- TestSubmitted.jsx
|   |       |-- VerifyEmail.jsx
|   |       |-- Welcome.jsx
|   |       |-- email-verified.jsx
|   |       `-- verify-email-info.jsx
|   `-- vite.config.js
`-- structure.txt

20 directories, 80 files
```

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm 9+
- MongoDB instance (local or Atlas)
- Groq API key (for AI features)
- Git for version control

### **Step 1: Clone Repository**
```bash
git clone https://github.com/ShivangChaurasia/AspireLens.git
cd AspireLens

Step 2: Backend Setup
cd backend
npm install

Create .env file:
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d

# Email (for verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# AI Configuration
GROQ_API_KEY=your_groq_api_key
AI_MODEL=llama3-70b-8192

# Application URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000


Step 3: Frontend Setup
cd ../frontend
npm install


Create .env file:
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AspireLens
VITE_APP_VERSION=1.0.0


Step 4: Run Development Servers
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

Access the application at http://localhost:5173

🔧 Environment Variables Reference
Mandatory Variables
MONGO_URI: MongoDB connection string

JWT_SECRET: Secret for JWT token signing

GROQ_API_KEY: API key for Groq AI service

Security Variables
JWT_EXPIRE: Token expiration time (default: 7d)

SMTP_*: Email service configuration

NODE_ENV: Environment (development/production)

Application Variables
PORT: Backend server port

CLIENT_URL: Frontend application URL

SERVER_URL: Backend server URL

AI_MODEL: Groq model identifier


```
📸 ###Screenshots
![Dashboard Interface](aspirelens-frontend/public/screenshots/dashboard.png)
*Modern dashboard with performance overview*

![Aptitude Test Interface](aspirelens-frontend/public/screenshots/test-interface.png)
*Timed test interface with progress tracking*

![AI Recommendations](aspirelens-frontend/public/screenshots/recommendations.png)
*Personalized career recommendations with match percentages*

![Admin Panel](aspirelens-frontend/public/screenshots/admin-panel.png)
*Administrative interface for content management*


```bash
🚢 Deployment
Frontend Deployment (Vercel/Netlify)
bash
cd frontend
npm run build
Connect your repository to Vercel/Netlify

Set VITE_API_URL to your production backend URL

Deploy automatically on push to main branch

Backend Deployment (Render/Railway)
Create new web service

Connect your repository

Set all environment variables from the .env section

Use npm start as start command

Database Setup
Create MongoDB Atlas cluster

Configure IP whitelist and database user

Update MONGO_URI with production connection string

Enable backup and monitoring

Environment Configuration
Ensure all production environment variables are set:

Use stronger JWT secrets

Configure production SMTP service

Set NODE_ENV=production

Enable CORS for your frontend domain

Configure rate limiting appropriately
```

🤝 Contributing
We welcome contributions that align with AspireLens's core principles:

Contribution Guidelines
Fork & Clone: Fork the repository and clone locally

Branch Naming: Use descriptive branch names (feature/, fix/, docs/)

Code Standards: Follow existing patterns and ESLint rules

Testing: Add tests for new features and verify existing ones

Documentation: Update relevant documentation

Pull Request: Submit PR with clear description and references

Core Rules (Non-negotiable)
❌ No changes to question uniqueness guarantees

❌ No frontend scoring logic - all scoring stays backend

❌ No hardcoded secrets in code

✅ Maintain data validation at every layer

✅ Preserve user privacy and data security

Areas Needing Contribution
Performance optimization

Additional test categories

UI/UX improvements

Documentation enhancement

Test coverage expansion

📜 License
MIT License

Copyright © 2025 AspireLens Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

⭐ Support & Recognition
If AspireLens helps you or someone you know, please consider:

Starring the repository ⭐

Sharing with educators and students

Providing feedback through issues

Contributing to development

Contact: For partnerships, institutional inquiries, or support: careerwith.aspirelens@gmail.com


