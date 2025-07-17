# QRA - Microblogging Platform

QRA (Quick Reach Analysis) is a full-stack microblogging platform where users can post updates in real time, interact with others, and where **admins can analyze platform trends using the Gemini API**. The platform is built with **React, Node.js, Express.js, MongoDB**, and **Tailwind CSS**, and includes user authentication, admin-only dashboards, and future-ready features like sentiment analysis.

🎥 [Watch Project Walkthrough Video](https://drive.google.com/file/d/1B_LYvy3s7FUTMwzqltgfhJsVgKWLA-q-/view?usp=sharing)


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

 🔐 Login & Authentication Screens

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

## 🧠 How It Works (Step-by-Step)

### 1. User Signup/Login
- Frontend uses Context API for global auth state.
- Credentials sent to `/api/auth/signup` or `/api/auth/login`.
- Backend validates and returns JWT stored in localStorage.

---
## 🏠 Homepage UI – Post Feed & Like Flow

<div style="display: flex;  justify-content: space-between; gap: 12px;">
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/HomeUser/NormalHomePage.png" width="600" />
    <p><strong>Normal Home Feed:</strong> Default landing feed with latest posts displayed.</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/HomeUser/LikedPhoto.png" width="600" />
    <p><strong>Like Functionality:</strong> User likes a post and it updates in real time.</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/HomeUser/PhotoremovedOnLikeOnrefresh.png" width="600" />
    <p><strong>Refresh Behavior:</strong> Liked post no longer appears after refresh to avoid duplicate likes.</p>
  </div>
</div>
<br/><br/>
## 🧠 How It Works (Step-by-Step)

### 2. Post Feed and Like Functionality
- On initial page load or refresh, the entire feed is populated using a `useEffect` hook that fires once after authentication is verified.
- This `useEffect` calls the route:

```js
  router.get('/all', checkToken, providePost);
```
- This route is protected by the checkToken middleware, which:
- Verifies the presence and validity of a JWT token
- Decodes the token to identify the user
- Blocks unauthorized requests with a 401 error if invalid

- Posts are rendered with lazy loading. This means:
- Only a limited number of posts are displayed initially
- As the user scrolls, more posts are fetched and rendered dynamically
- This helps maintain performance even with a large number of posts

```js
  router.post('/like/:postid', checkToken, likeHandel);
```
- This route updates the post’s likes array in the database with the user’s ID
- The UI reflects the change immediately using optimistic updates
- On refresh, the liked post is filtered from the main feed to prevent reliking the same post

<br/><br/>

## 🏠 ProfilePage UI – Update Photo
<div style="display: flex;  justify-content: space-between; gap: 12px;">
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/Profile/NoImage.png" width="600" />
    <p><strong>Profile :</strong> Default landing with no Image.</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/Profile/ImageAddedinProfile.png" width="600" />
    <p><strong>Profile with Image:</strong>Image Uploded with help of Multer(LocalStorage).</p>
  </div>
</div>

<br/><br/>
### 🧠 How It Works

Image Upload and update it via Storing locally in the multer
### 3. Profile Image Functunality

```js
router.post('/profile/photo', checkToken, upload.single("profile-image"), updateImage);
```
- This route allows users to upload their profile photo.
- It uses multer middleware to handle image file upload and saves it locally (can be later upgraded to cloud storage).
- The checkToken middleware ensures only logged-in users can upload.
- On successful upload, the image is linked to the user profile.

``` js
router.get('/profile', checkToken, profileSec);
```
- This route is used to fetch the user’s profile details like name, email, and profile image URL.
- Called via a useEffect() in the Profile component after login or reload.
- Ensures the UI always shows updated user info and image consistently.

 <br/><br/>
## 🚀 Post/Upload Page UI 
<div style="display: flex;  justify-content: space-between; gap: 12px;">
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/UserPosts/CreatePostPage.png" width="600" />
    <p><strong>Post/Upload Page:</strong> Default landing with no content added</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/UserPosts/ContentWrittenandmageselected.png" width="600" />
    <p><strong>Profile with Image:</strong>Image Uploded with title and Description</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/UserPosts/SelectedImageshownonPostsPage.png" width="600" />
    <p><strong>Profile with Image:</strong>Image Uploded with title and Description Can be Seen on Personal Post Page</p>
  </div>
</div>



<br/><br/>
## 🛡️ Post/Upload Page UI 
<div style="display: flex;  justify-content: space-between; gap: 12px;">
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/AdminPanel/AdminHome.png" width="600" />
    <p><strong>Home Page:</strong> Default landing Home Page but with extra Button Trends in SideBar</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/AdminPanel/ViewTrendingPage.png" width="600" />
    <p><strong>Trending Page:</strong>Show top 10 images liked till now and arranges in order newest image comes first</p>
  </div>
  <br/><br/>
  <div style="flex: 1/3; text-align: center;">
    <img src="./assests/AdminPanel/AnalysisResultWithgemini.png" width="600" />
    <p><strong>Trends Analysis:</strong>Connected to Gemini Api on button press Analysis is provided by gemini API</p>
  </div>
</div>

<br/><br/>

### 🧠 How It Works
- Admin dashboard fetches top 10 posts (based on likes).
- Posts are sent to Gemini API → returns summarized trends.
- Admin sees 5-point summaries about community interest.
### 4. Admin Page and Trend fuctunality

```js
router.get('/trends',checkToken,trendPosts);
```
- This route gets/fetch all the photos from DB based on mostlike and newest in the timeline
- It uses multer middleware to getPhotos based on it's localStorage.
- The checkToken middleware ensures only admin can visit this page as admin_ID is stored in .env .

``` js
router.post('/analyze-trends', checkToken, analyzeTrends);
```
- This route is restricted to admin users and triggers AI-based analysis of recent posts.
- The backend securely calls Google's Gemini API using your API key Stored in .env .
- The result is shown on the admin dashboard as a 5-point insight summary, helping admins track what's popular or gaining traction.

 <br/><br/>

## ⚙️ Tech Stack

| Frontend         | Backend               | Tools / APIs             |
|------------------|------------------------|---------------------------|
| React + Vite     | Node.js, Express.js    | Gemini API (Google AI)    |
| Tailwind CSS     | MongoDB (Mongoose)     | Postman, Git              |
| React Router     | JWT Authentication     | VSCode, GitHub            |
| Context API      |                        |                           |

<br/><br/>
---

## 📈 System Architecture

📌 *Diagram will be inserted once draw.io images are ready*

---

<br/><br/>

### Planned Feature – Sentiment Analysis
- Admin will be able to search users and fetch post sentiments.
- Gemini API will analyze tone (positive/negative/neutral).
- Results visualized in the dashboard.

---


