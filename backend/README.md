# Music Store Backend API

Complete backend for Music Instruments Store with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB
Make sure MongoDB is installed and running on your system:
- **Windows**: Install MongoDB Community Edition
- **MongoDB Compass** (GUI): Recommended for viewing data
- Default connection: `mongodb://localhost:27017`

### 3. Configure Environment
The `.env` file is already created with default settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/music-store
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Email (Gmail)
For contact form and notifications:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password
3. Update the `.env` file:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Your Name <your_email@gmail.com>
```

### 5. Seed Database
Populate the database with initial data:
```bash
npm run seed
```

This will create:
- Categories (6 types)
- Products (10 sample products)
- Admin user: `admin@musicstore.com` / `admin123`
- Test user: `user@test.com` / `user123`

### 6. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── seed.js         # Database seeding script
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   └── orderController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Review.js
│   └── Blog.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   └── orderRoutes.js
├── utils/
│   └── generateToken.js
├── .env
├── package.json
└── server.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/id/:id` - Update product (Admin)
- `DELETE /api/products/id/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/id/:id` - Update category (Admin)
- `DELETE /api/categories/id/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/pay` - Update payment status (Protected)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Login Response:**
```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@email.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

**Using Token:**
Include in request headers:
```
Authorization: Bearer <your_token_here>
```

## 💳 Payment Processing

The application supports multiple payment methods:
- **Cash on Delivery (COD)** - Default option
- **Credit/Debit Cards** - For future online payment integration
- **UPI/Wallets** - For future online payment integration

Currently, all payments are processed as Cash on Delivery. Online payment integration can be added in the future.

## 📦 Features

- ✅ User authentication & authorization
- ✅ JWT-based security
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Order processing
- ✅ Stock management
- ✅ User profiles
- ✅ Admin panel support
- ✅ Search & filters
- ✅ Password hashing
- ✅ CORS enabled
- ✅ Email notifications

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **Nodemailer** - Email service

## 💡 Usage Tips

1. **Test API with Postman or Thunder Client**
2. **View database with MongoDB Compass**
3. **Admin credentials for testing:**
   - Email: `admin@musicstore.com`
   - Password: `admin123`

## 🔄 Next Steps

After backend is running:
1. Start frontend: `cd frontend && npm run dev`
2. Frontend will connect to backend automatically
3. Test the complete flow from UI

## ⚠️ Important Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- MongoDB must be running before starting server
- Run seed script only once to populate initial data
- For production, use proper SSL certificates and secure environment variables