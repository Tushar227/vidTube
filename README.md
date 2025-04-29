# 📺 vidTube – Full Stack Project

A complete full-stack video-sharing platform inspired by YouTube. Built with **Node.js**, **Express**, **MongoDB**, and **React**, it includes features like video upload, comments, playlists, likes, channel subscriptions, and JWT-based authentication.

---

## 🧩 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🚀 Setup and Installation](#-setup-and-installation)
- [📦 Environment Variables](#-environment-variables)
- [📡 API Overview](#-api-overview)
- [📷 Screenshots](#-screenshots)
- [📌 Future Improvements](#-future-improvements)
- [📬 Contact](#-contact)

---

## ✨ Features

### 🔐 Authentication
- Register, Login, Logout, JWT-based token rotation
- Upload avatar & cover image via **Cloudinary**

### 🎥 Videos
- Upload, edit, delete, toggle publish
- Like/Unlike videos
- View video details + comments

### 💬 Comments
- Add, edit, delete comments
- Like/unlike comments

### 📃 Playlists
- Create/edit/delete playlists
- Add/remove videos
- View playlist details

### 🔔 Subscriptions
- Subscribe/unsubscribe to channels
- View subscribers and subscribed channels

### ❤️ Likes
- Like/unlike videos and comments
- View all liked videos

### 📊 Dashboard
- Get total videos, subscribers, likes, and subscribed channels

### ✅ Extras
- Tweets (basic microblogging)
- Full SPA routing

---

## 🛠️ Tech Stack

| Layer       | Tech                                   |
|-------------|----------------------------------------|
| **Frontend**| React, React Router, Bootstrap, Axios  |
| **Backend** | Node.js, Express.js, Mongoose          |
| **Database**| MongoDB (Atlas)                        |
| **Cloud**   | Cloudinary (video & image storage)     |
| **Auth**    | JWT, HttpOnly cookies, refresh tokens  |

---

## 📁 Folder Structure

```bash
vidTube/
├── backend/             # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── public/
│   └── index.js, app.js
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── utils/axios.js
│   └── public/
├── .gitignore
├── README.md
└── package.json (both frontend & backend)
```

---

## 🚀 Setup and Installation

### Prerequisites
- Node.js v16+
- MongoDB Atlas or Local MongoDB
- Cloudinary account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vidTube.git
cd vidTube
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Create Environment Files

- Copy and rename `.env.sample` to `.env` inside `/backend`
- Set values for:

```env
PORT=7000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run the App

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will be running at:  
🔗 `http://localhost:5173`  
Backend runs at:  
🔗 `http://localhost:7000/api/v1`

---

## 📦 Environment Variables

Create a `.env` in `/backend`:

```
PORT=7000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<cloud-api-key>
CLOUDINARY_API_SECRET=<cloud-api-secret>
```

---

## 📡 API Overview

| Route | Description |
|-------|-------------|
| `/users`         | Register, Login, Refresh, Profile, Avatar, Cover |
| `/videos`        | Upload, Fetch, Edit, Delete, Like, Toggle |
| `/comments`      | Add/Edit/Delete Comments |
| `/playlists`     | Create, Edit, Delete, Add/Remove Video |
| `/likes`         | Toggle likes on videos/comments, Get liked videos |
| `/subscriptions` | Toggle, Fetch Subscribers/Subscribed channels |
| `/tweets`        | (Optional) Post/Edit/Delete Tweets |
| `/dashboard`     | Get real-time channel analytics |

---


## 📌 Future Improvements

- [ ] Real-time chat & notifications
- [ ] Dark mode & accessibility support
- [ ] Video monetization logic
- [ ] Admin dashboard
- [ ] Use WebSockets for comment/live updates

---

## 📬 Contact

**Prakhar Porwal**  
✉️ prakhar2001porwal@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/prakharporwal)

---

_Thanks for checking out **vidTube**! Feel free to ⭐ star the repo if you like it._
