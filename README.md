# Student Idea and Startup Hub

A MERN stack application for students to post startup ideas and collaborate.

## Features

- User registration and login
- Submit startup ideas
- View and upvote ideas
- Comment on ideas
- AI-powered chatbot for startup advice and collaboration help

## Setup

### Prerequisites

1. **Install MongoDB Community Server**:
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Node.js**: Make sure Node.js is installed

### Backend

1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/student-startup-hub
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

   - For MongoDB Atlas, use your connection string
4. Start server: `npm run dev`

### Frontend

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start app: `npm start`

## Usage

- Register a new account or login
- Submit ideas from the dashboard
- View ideas, upvote them, and add comments
- Use the AI chatbot (bottom right) for advice on startup ideas, business strategies, and collaboration tips

## Technologies

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT

### Frontend

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start app: `npm start`

## Usage

- Register or login
- Submit ideas from dashboard
- View ideas, upvote, and comment

## Technologies

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT
