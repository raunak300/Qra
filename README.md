# QRA - Microblogging Platform

QRA (Quick Reach Analysis) is a full-stack microblogging platform where users can post updates in real time, interact with others, and where **admins can analyze platform trends using the Gemini API**. The platform is built with **React, Node.js, Express.js, MongoDB**, and **Tailwind CSS**, and includes user authentication, admin-only dashboards, and future-ready features like sentiment analysis.

> 🎥 [Watch Project Walkthrough Video](https://drive.google.com/file/d/1B_LYvy3s7FUTMwzqltgfhJsVgKWLA-q-/view?usp=sharing)
---

## 🚀 Features

### 🧑‍💻 User Features
- Sign up & secure login
- Create & edit micro-posts
- View top trending posts
- Profile and activity overview

### 🛡️ Admin Features
- Role-based login access
- Dashboard to analyze top 10 daily posts
- Gemini API integration for real-time trend analysis
- Planned: Sentiment analysis for searched users

---

## 📽️ Project Preview


<br/>
## 🔐 Login & Authentication Screens

<div align="flex flex-col">

### ✅ Login Successful  
<img src="./assests/LoginAssets/LoginDone.png" alt="Login Done" width="600"/>
<p>User successfully logs in with correct credentials.</p>

<br/><br/>

### 🛡️ Token Created  
<img src="./assests/LoginAssets/TokenCreated.png" alt="JWT Token Created" width="600"/>
<p>JWT token is generated and stored upon login for secure session handling.</p>

<br/><br/>

### ❌ Invalid Login Attempt  
<img src="./assests/LoginAssets/WrongLogin.png" alt="Wrong Login" width="600"/>
<p>Error message shown when invalid credentials are submitted.</p>

</div>





---

## ⚙️ Tech Stack

| Frontend         | Backend               | Tools / APIs             |
|------------------|------------------------|---------------------------|
| React + Vite     | Node.js, Express.js    | Gemini API (Google AI)    |
| Tailwind CSS     | MongoDB (Mongoose)     | Postman, Git              |
| React Router     | JWT Authentication     | VSCode, GitHub            |
| Context API      |                        |                           |

---

## 📈 System Architecture

📌 *Diagram will be inserted once draw.io images are ready*

---

## 🧠 How It Works (Step-by-Step)

### 1. User Signup/Login
- Frontend uses Context API for global auth state.
- Credentials sent to `/api/auth/signup` or `/api/auth/login`.
- Backend validates and returns JWT stored in localStorage.

### 2. Post Creation
- Authenticated users can create posts via `/api/post/create`.
- Posts contain text, likes, user ref, and timestamps.
- Posts are displayed in real-time feed using `useEffect` hooks.

### 3. Admin Trend Analysis
- Admin dashboard fetches top 10 posts (based on likes).
- Posts are sent to Gemini API → returns summarized trends.
- Admin sees 5-point summaries about community interest.

### 4. Planned Feature – Sentiment Analysis
- Admin will be able to search users and fetch post sentiments.
- Gemini API will analyze tone (positive/negative/neutral).
- Results visualized in the dashboard.

---

## 📁 Folder Structure

