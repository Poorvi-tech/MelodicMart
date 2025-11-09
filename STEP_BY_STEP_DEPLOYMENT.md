# Step-by-Step Deployment Guide

This document provides a detailed, step-by-step guide for deploying your Music Instruments Store with the backend on Render and the frontend on Vercel, while maintaining the ability to run locally.

## Overview

1. **Local Development**: Run both frontend and backend on localhost
2. **Backend Deployment**: Deploy Node.js backend to Render
3. **Frontend Deployment**: Deploy Next.js frontend to Vercel

## Prerequisites

Before starting, ensure you have:
- GitHub account
- Render account
- Vercel account
- MongoDB Atlas account (or any MongoDB hosting service)
- Node.js installed locally

## Step 1: Prepare Your Code for Deployment

### 1.1 Backend Preparation
Files already created/modified:
- [x] `backend/render.yaml` - Render deployment configuration
- [x] `backend/.env.production.example` - Production environment variables template
- [x] Updated `backend/server.js` to bind to '0.0.0.0' for Render compatibility
- [x] Updated CORS configuration in `backend/server.js` to support production domains

### 1.2 Frontend Preparation
Files already created/modified:
- [x] `frontend/vercel.json` - Vercel deployment configuration
- [x] `frontend/.env.production.example` - Production environment variables template
- [x] Updated `frontend/lib/apiService.ts` to handle production API URLs

## Step 2: Set Up MongoDB Database

### 2.1 Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a new database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) in Network Access settings

### 2.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string and replace `<password>` with your user's password

## Step 3: Deploy Backend to Render

### 3.1 Push Code to GitHub
1. Initialize git repository (if not already done):
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub
3. Push your code:
   ```bash
   git remote add origin <your-repository-url>
   git branch -M main
   git push -u origin main
   ```

### 3.2 Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub account and select your repository
4. Configure:
   - Name: music-store-backend (or your preferred name)
   - Region: Choose the closest to your users
   - Branch: main
   - Root Directory: Leave empty (backend is root)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

### 3.3 Configure Environment Variables
In your Render service dashboard:
1. Go to "Environment Variables"
2. Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (e.g., use `openssl rand -hex 32`)
   - `JWT_EXPIRE`: 7d
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your frontend URL (will be set in Step 5)
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password
   - `EMAIL_FROM`: "Music Haven <your_email@gmail.com>"

### 3.4 Complete Deployment
Render will automatically deploy your application. Note the URL (e.g., https://music-store-backend.onrender.com).

## Step 4: Deploy Frontend to Vercel

### 4.1 Push Code to GitHub
1. If not already done, initialize git repository:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Push your code to GitHub (can be same or different repository)

### 4.2 Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Project Name: music-store-frontend (or your preferred name)
   - Framework Preset: Next.js
   - Root Directory: frontend
5. Click "Deploy"

### 4.3 Configure Environment Variables
In your Vercel project dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add this variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., https://music-store-backend.onrender.com/api)

### 4.4 Redeploy
After setting environment variables, you need to redeploy:
1. Go to "Deployments"
2. Click the three dots next to the latest deployment
3. Select "Redeploy"

## Step 5: Update Backend CORS Settings

Now that you have your frontend URL from Vercel:
1. Go back to your Render service
2. Update the `FRONTEND_URL` environment variable with your Vercel frontend URL
3. Trigger a new deployment by clicking "Manual Deploy" → "Deploy latest commit"

## Step 6: Test Your Deployed Application

1. Visit your frontend URL (from Vercel)
2. Test all functionality:
   - User registration and login
   - Product browsing
   - Adding items to cart
   - Placing orders
   - Admin functionality (if you have admin credentials)

## Step 7: Running Locally

To run your application locally:

### 7.1 Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create `.env` file:
   ```bash
   cp .env.production.example .env
   ```
3. Update `.env` with your local configuration
4. Start the server:
   ```bash
   npm run dev
   ```

### 7.2 Frontend
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Create `.env.local` file:
   ```bash
   cp .env.production.example .env.local
   ```
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` in backend environment variables matches your frontend URL
   - Check that CORS configuration in `server.js` includes your frontend domain

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_URL` in frontend environment variables
   - Check that your backend is running and accessible

3. **Database Connection Issues**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB IP whitelist includes Render IPs (0.0.0.0/0)

4. **Environment Variables Not Working**:
   - Changes to environment variables require redeployment
   - Check that variable names exactly match what the code expects

### Logs and Debugging

1. **Render Logs**:
   - In your Render service dashboard, go to "Logs" to see backend logs

2. **Vercel Logs**:
   - In your Vercel project dashboard, go to "Functions" to see frontend logs

## Updating Your Application

To update your deployed application:

1. **Backend (Render)**:
   - Push changes to your GitHub repository
   - Render will automatically redeploy on new commits to the main branch

2. **Frontend (Vercel)**:
   - Push changes to your GitHub repository
   - Vercel will automatically redeploy on new commits to the main branch

## Conclusion

You now have:
- A fully functional local development environment
- A production-ready backend deployed on Render
- A production-ready frontend deployed on Vercel
- The ability to switch between local and production environments

Remember to:
- Keep your environment variables secure
- Regularly update dependencies
- Monitor your applications for errors
- Backup your MongoDB database regularly