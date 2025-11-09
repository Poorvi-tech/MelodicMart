# Deployment Guide

This guide explains how to deploy the Music Instruments Store application with the backend on Render and the frontend on Vercel.

## Prerequisites

1. Accounts:
   - Render account (for backend deployment)
   - Vercel account (for frontend deployment)
   - MongoDB Atlas account (or any MongoDB hosting service)

2. Domain names (optional but recommended):
   - One for your frontend (e.g., mystore.vercel.app)
   - One for your backend (e.g., mybackend.onrender.com)

## Backend Deployment on Render

1. **Prepare your MongoDB database:**
   - Create a MongoDB database on MongoDB Atlas or your preferred provider
   - Whitelist all IP addresses (0.0.0.0/0) in your MongoDB Atlas network access settings
   - Get your MongoDB connection string

2. **Push your code to GitHub:**
   - Make sure your backend code is pushed to a GitHub repository
   - The repository should include the `render.yaml` file we created

3. **Deploy on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the branch you want to deploy (usually main/master)
   - Set the name for your service
   - Ensure the environment is set to "Node"
   - The build and start commands should be auto-detected from package.json
   - Click "Create Web Service"

4. **Configure Environment Variables on Render:**
   - In your Render service dashboard, go to "Environment Variables"
   - Add the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret for JWT tokens
     - `JWT_EXPIRE`: Token expiration time (e.g., 7d)
     - `NODE_ENV`: production
     - `FRONTEND_URL`: Your frontend URL (e.g., https://your-store.vercel.app)
     - `EMAIL_USER`: Your Gmail address for sending emails
     - `EMAIL_PASS`: Your Gmail app password
     - `EMAIL_FROM`: Email sender information

5. **Complete Deployment:**
   - Render will automatically deploy your application
   - Note the URL provided by Render (e.g., https://your-service.onrender.com)

## Frontend Deployment on Vercel

1. **Push your code to GitHub:**
   - Make sure your frontend code is pushed to a GitHub repository
   - The repository should include the `vercel.json` file we created

2. **Deploy on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set the project name
   - Make sure the framework preset is set to "Next.js"
   - Set the root directory to "frontend"
   - Click "Deploy"

3. **Configure Environment Variables on Vercel:**
   - In your Vercel project dashboard, go to "Settings" > "Environment Variables"
   - Add the following variable:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., https://your-backend.onrender.com/api)

4. **Complete Deployment:**
   - Vercel will automatically deploy your application
   - Note the URL provided by Vercel (e.g., https://your-store.vercel.app)

## Post-Deployment Steps

1. **Update CORS settings (if needed):**
   - If you have specific domain names, update the CORS configuration in your backend server.js
   - Make sure to redeploy your backend after making changes

2. **Test the deployed application:**
   - Visit your frontend URL
   - Test all functionality including API calls to the backend
   - Verify that images load correctly
   - Test user registration, login, and other features

3. **Set up custom domains (optional):**
   - In Vercel, you can add a custom domain for your frontend
   - In Render, you can add a custom domain for your backend
   - Update environment variables accordingly if you change domains

## Redeployment

Whenever you make changes to your code:

1. **Backend (Render):**
   - Push changes to your GitHub repository
   - Render will automatically redeploy on new commits to the main branch
   - Or manually trigger a deployment from the Render dashboard

2. **Frontend (Vercel):**
   - Push changes to your GitHub repository
   - Vercel will automatically redeploy on new commits to the main branch
   - Or manually trigger a deployment from the Vercel dashboard

## Troubleshooting

1. **CORS errors:**
   - Check that FRONTEND_URL in your backend environment variables matches your frontend URL
   - Ensure CORS configuration in server.js includes your frontend domain

2. **API connection issues:**
   - Verify that NEXT_PUBLIC_API_URL in your frontend environment variables points to the correct backend URL
   - Check that your backend is running and accessible

3. **Database connection issues:**
   - Verify that MONGODB_URI is correct
   - Check that your MongoDB IP whitelist includes Render's IPs (0.0.0.0/0 for MongoDB Atlas)

4. **Environment variables not working:**
   - Double-check that all environment variables are correctly set in the respective dashboards
   - Remember that changes to environment variables require a redeployment