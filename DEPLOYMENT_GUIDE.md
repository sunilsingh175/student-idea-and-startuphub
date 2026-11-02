# 🚀 Deployment Guide: Student Idea and Startup Hub

This guide walks you through deploying the **Student Idea and Startup Hub** to production for free using **Render** (Backend) and **Vercel** (Frontend).

---

## 📋 Step 0: MongoDB Atlas Pre-requisite (Crucial!)

Because cloud hosts like Render use dynamic IP addresses, you must allow connections from any IP in MongoDB Atlas:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, click **Network Access**.
3. Click **Add IP Address**.
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.

---

## 🛠️ Step 1: Deploy Backend (Render Web Service)

1. Push your code to a GitHub repository (e.g. `student-idea-hub`).
2. Go to [Render.com](https://render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `student-hub-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Scroll down to **Environment Variables** and add the following:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://startuphub695_db_user:UzWisMEHjnTXU1sY@cluster0.nwllmfr.mongodb.net/student-startup-hub` |
| `JWT_SECRET` | `8e213e8fd26ba873e16765c43c0ceddfb7c681d65c10337383f528587a1c8faf874c5cbfb18f79ca38ebe68a41386d5160991d6e45239ef04761f36647cefb71` |
| `GOOGLE_API_KEY` | `AIzaSyDYb9j9ow_EYCNoc5f_vUsZuHbaHLxOSGc` |
| `EMAIL_USER` | `startuphub695@gmail.com` |
| `EMAIL_PASS` | `fitukryshtmhjxks` |

6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://student-hub-backend.onrender.com`).

---

## 🎨 Step 2: Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com/) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In **Project Configuration**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: click **Edit** and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://your-backend-app.onrender.com/api` *(replace with your actual Render URL + `/api`)* |

5. Click **Deploy**.
6. Vercel will build and launch your site with free HTTPS and global CDN.

---

## ✅ Pre-Configured Deployment Files in This Repository

1. **`frontend/src/services/api.js`**:
   - Auto-detects `process.env.REACT_APP_API_URL` with fallback to `http://localhost:5000/api` for local development.
2. **`frontend/vercel.json`**:
   - Configured with SPA rewrite rules to ensure refreshing pages like `/messages` or `/profile` never return 404.
3. **`frontend/public/_redirects`**:
   - Included for Netlify and Render Static Site compatibility (`/* /index.html 200`).
4. **`.gitignore`**:
   - Configured in root, frontend, and backend to keep `.env` credentials and `node_modules` secure.

---

## 🧪 Post-Deployment Verification Checklist

- [ ] Visit your deployed Vercel site.
- [ ] Register a new account with email verification OTP.
- [ ] Submit an idea and see it appear on the Dashboard.
- [ ] Test the WhatsApp-style **💬 Chat** between two accounts.
- [ ] View and edit your profile at `/profile`.
