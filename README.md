# FriendsChat - Real-Time Chat App

FriendsChat is a full-stack chat application with real-time messaging, online status, typing indicators, message reactions, emoji, and file previews. Built with React, Tailwind CSS, Node.js/Express, MongoDB, and Socket.io, it works seamlessly on both mobile devices and desktop screens.

---

## 🔥Features

- User authentication: login/logout flow with context-based state   
  management and JWT-based stateless authentication
- Online/offline indicators for every user
- Last message preview with truncation for long texts, hover to expand 
  full messages
- Unread message counts for each conversation in the sidebar
- Typing indicators in both chat and sidebar
- Heart reactions and emoji reactions on messages
- Edit/Delete messages in real-time
- Send image/file attachments with live preview
- Responsive layout: adjusts chat width vs sidebar based on screen and  
  selection

---

## ⚙️ Tech Stack

### Frontend
- React (Hooks, Context API)  
- Tailwind CSS for responsive and modern UI  
- React Router v7 for client-side routing  
- React Query for fetching/caching messages  
- Socket.io-client for real-time updates  
- Emoji-picker-react for selecting emoji  
- Axios for API requests  
- Vite for build tooling  

### Backend
- Node.js + Express.js for REST API endpoints  
- MongoDB with Mongoose for database  
- JWT for stateless authentication  
- Socket.io for real-time communication  
- Multer & file-type for file/image uploads and validation
- Bcryptjs for password hashing  
- Cloudinary for image hosting  
- Express-validator for server-side validation 
- Winston for logging errors  

---

## 🚀 Getting Started

### 1. Clone the repo
git clone https://github.com/Nikos32-ux/FriendsChat.git

### 1.a Backend setup
cd backend
npm install
npm run dev

### 1.b Backend Environment Variables
  Create a `.env` file in the `backend` folder with your own values:
- **MONGO_URI** – MongoDB connection string (local or Atlas)  
- **PORT** – Port for backend server  
- **JWT_SECRET** – Secret for signing JSON Web Tokens  
- **CLIENT_URL** – Frontend URL for CORS  
- **CLOUDINARY_*** – Credentials for uploading images  
- **NODE_ENV** – `development` or `production`


### 3.a Frontend setup
cd frontend
npm install
npm run dev

### 3.b Frontend Environment Variables
Create a `.env` file in the `frontend` folder with your own values for local:
VITE_API_URL=http://localhost:8000

and a `.env.production` for production :
VITE_API_URL=https://your-backend-url
 


 

Notes:
- Audio notifications: new message (notify.mp3), send message 
  (sendMessage.mp3), heart click (clickHeart.mp3)

-Full message hover works best on Chrome/Edge

-Ensure MongoDB is running locally or on Atlas; add .env keys for JWT,   
 Mongo URI, Cloudinary



🌐 Local Development
   Frontend: http://localhost:5173
   Backend: http://localhost:8000

🌍 Live Demo
   Frontend: https://friends-chat-six.vercel.app
   Backend: https://thechatapp-ppoz.onrender.com