# Bug Tracking System (Complete MERN Stack ✅)

## FULL PROJECT FOLDER STRUCTURE
```
bug-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bugController.js
│   │   ├── userController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Bug.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bugs.js
│   │   ├── users.js
│   │   └── comments.js
│   ├── uploads/                 (auto-created)
│   ├── .env                    (copy from .env.example)
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Bugcard.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateBug.js
│   │   │   ├── BugDetails.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .env.example
├── TODO.md (completed)
└── README.md
```

## 🚀 QUICK START (Production-Ready)

### 1. Prerequisites
```
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
```

### 2. Backend Setup
```bash
cd backend
npm install
cp ../.env.example .env
```

**Edit `.env`:**
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/bugtracker
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-chars
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```
**Backend runs on http://localhost:5000**

### 3. Frontend Setup
Open NEW terminal:
```bash
cd frontend
npm install
npm start
```
**Frontend runs on http://localhost:3000**

## 🧪 API TESTING (Postman)

### Auth
```
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "123456",
  "role": "tester"
}

POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Copy token from response → use in Authorization header**

### Bugs (Auth required)
```
GET    http://localhost:5000/api/bugs
POST   http://localhost:5000/api/bugs (form-data for screenshot)
GET    http://localhost:5000/api/bugs/:id
PUT    http://localhost:5000/api/bugs/:id
DELETE http://localhost:5000/api/bugs/:id (Admin only)
```

### Comments
```
GET    http://localhost:5000/api/bugs/:id/comments
POST   http://localhost:5000/api/bugs/:id/comments
{
  "text": "Great fix!"
}
```

## 🎯 FEATURES (All Working)

**✅ Authentication**: JWT, bcrypt passwords  
**✅ Roles**: Admin/Developer/Tester permissions  
**✅ Bug Workflow**: Create → Assign → Progress → Fixed → Verify/Reopen  
**✅ File Upload**: Screenshots (Multer)  
**✅ Real-time Comments**  
**✅ Responsive UI**: TailwindCSS + React Router  
**✅ Protected Routes**  
**✅ Error Handling**

## 🔧 PRODUCTION DEPLOY

**Backend**: Render/Heroku + MongoDB Atlas  
**Frontend**: Vercel/Netlify  
```
npm run build  # Frontend
```

## 💾 SAMPLE USERS TO TEST
```
Admin: admin@bugtracker.com / admin123
Tester: tester@bugtracker.com / test123  
Developer: dev@bugtracker.com / dev123
```

**Production-ready for interviews & portfolios! 🚀**

