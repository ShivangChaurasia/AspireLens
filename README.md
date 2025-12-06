
# 🌟 **AspireLens – AI-Powered Career Guidance Platform**

AspireLens is a modern MERN-based web application that empowers students to discover the right career path using **aptitude assessments**, **AI-generated recommendations**, and **personalized roadmaps**.
The platform aims to make **career guidance simple, accessible, and accurate** for every learner.

---

## 🚀 **Features**

### 🎯 **Aptitude Test Module**

* Multi-category test (Logical, Verbal, Creativity, Personality)
* Timed questions & smooth navigation
* Smart scoring with backend evaluation

### 🤖 **AI-Based Career Recommendations**

* AI model analyzes scores + interests
* Generates best-fit careers with match percentages
* Offers relevant insights and reasoning

### 📘 **Personalized Career Roadmaps**

* Subjects to select in higher secondary
* Skills to build, certifications to pursue
* Step-by-step timeline to reach the desired career

### 🖥️ **Modern, Responsive UI**

* Neo-modern gradient + glassmorphic design
* Smooth, intuitive navigation
* Optimized for mobile, tablet, and desktop

### 🔐 **Secure Authentication**

* JWT-based login & registration
* Role-based access for students and admin
* User-specific history & saved results

### 🧑‍💼 **Admin Panel**

* Add/manage aptitude questions
* Add/manage career pathways
* Track user performance & analytics

---

## 🧠 **Tech Stack**

### **Frontend**

* React.js
* TailwindCSS / Bootstrap
* Axios
* React Router
* Chart.js / Recharts

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* AI API Integration (OpenAI/OpenRouter)

### **Database**

* MongoDB Atlas / Local MongoDB

---

## 📂 **Project Structure**

```
AspireLens/
 ┣ backend/
 │  ┣ controllers/
 │  ┣ models/
 │  ┣ routes/
 │  ┣ config/
 │  ┗ server.js
 ┣ frontend/
 │  ┣ src/
 │  │  ┣ components/
 │  │  ┣ pages/
 │  │  ┣ utils/
 │  │  ┗ App.js
 │  ┗ public/
 ┗ README.md
```

---

## 🛠️ **API Endpoints**

### 🔐 Authentication

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register new user         |
| POST   | `/api/auth/login`    | Login & receive JWT token |

### 📝 Aptitude Test

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/questions`       | Fetch aptitude questions |
| POST   | `/api/test/submit`     | Submit responses         |
| GET    | `/api/test/result/:id` | View result details      |

### 🎯 Career Guidance

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | `/api/career/recommend` | AI-based recommendation |
| GET    | `/api/career/all`       | List all careers        |
| GET    | `/api/career/:id`       | Fetch career details    |

---

## ⚙️ **Installation & Setup**

### **1. Clone Repository**

```bash
git clone https://github.com/your-username/AspireLens.git
cd AspireLens
```

### **2. Install Backend Dependencies**

```bash
cd backend
npm install
```

### **3. Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### **4. Create `.env` Files**

#### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_ai_key
PORT=5000
```

#### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:5000
```

### **5. Run the Application**

```bash
# Backend
npm run dev

# Frontend
npm start
```

---

## 📸 **Screenshots (Add to repo later)**

```
assets/
 ┣ home.png
 ┣ dashboard.png
 ┣ aptitude_test.png
 ┣ results.png
 ┗ career_suggestions.png
```

Add screenshots in the README like this:

```markdown
![Homepage](assets/home.png)
![Dashboard](assets/dashboard.png)
```

---

## 🌍 **Deployment**

Supports:

* Vercel / Netlify (Frontend)
* Render / Railway / Heroku (Backend)

**Frontend build:**

```bash
npm run build
```

---

## 🤝 **Contributing**

Contributions are always welcome!

1. Fork this repo
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Submit a PR

---

## 📜 **License**

MIT License © 2025 — *AspireLens*

---

## ⭐ **Support**

If you like this project, please **star⭐ the repository** to support development!

