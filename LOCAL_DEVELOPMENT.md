# Local Development Setup

## Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or cloud)

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.production.example`:
   ```
   cp .env.production.example .env
   ```

4. Update the `.env` file with your actual values:
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: A secure secret for JWT tokens
   - EMAIL_USER and EMAIL_PASS: Your Gmail credentials (for contact form)

5. Run the backend server:
   ```
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.production.example`:
   ```
   cp .env.production.example .env.local
   ```

4. Update the `.env.local` file with your backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. Run the frontend development server:
   ```
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Running Both Services

To run both services simultaneously:

1. Start the backend in one terminal:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend in another terminal:
   ```
   cd frontend
   npm run dev
   ```

3. Access your application at `http://localhost:3000`

## Seeding Initial Data (Optional)

To populate your database with initial data:

```
cd backend
npm run seed
```