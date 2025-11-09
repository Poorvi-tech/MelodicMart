# Music Instruments Store - Frontend

A modern e-commerce application for musical instruments built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎵 Features

- 🛍️ Complete e-commerce functionality (products, cart, checkout)
- ❤️ Wishlist and product comparison
- 🔐 User authentication and profiles
- 📦 Order management and tracking
- 💳 Multiple payment options (COD, Cards, UPI)
- 📱 Fully responsive design
- 🔍 Product search and filtering
- ⭐ Product reviews and ratings
- 📧 Contact form with email notifications
- 👨‍💼 Admin dashboard for product/order management

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   ├── admin/           # Admin dashboard
│   ├── cart/            # Shopping cart
│   ├── categories/      # Product categories
│   ├── checkout/        # Checkout process
│   ├── compare/         # Product comparison
│   ├── contact/         # Contact page
│   ├── orders/          # Order management
│   ├── products/        # Product details
│   ├── profile/         # User profile
│   ├── wishlist/        # Wishlist
│   └── page.tsx         # Home page
├── components/          # Reusable UI components
├── data/                # Static data (categories, products)
├── lib/                 # Utilities and services
│   ├── apiService.ts    # API service layer
│   ├── store.ts         # Zustand state management
│   └── types.ts         # TypeScript types
├── public/              # Static assets
└── styles/              # Global styles
```

## 🔧 Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 💳 Payment Processing

The store supports multiple payment methods:

1. **Cash on Delivery (COD)** - Default option for traditional checkout
2. **Credit/Debit Cards** - For future online payment integration
3. **UPI/Wallets** - For future online payment integration

Currently, all payments are processed as Cash on Delivery. Online payment integration can be added in the future.

## 🎨 UI Components

- **Product Cards** - With add to cart, wishlist, and compare options
- **Shopping Cart** - With quantity adjustment and real-time pricing
- **Checkout Flow** - Multi-step process with address and payment selection
- **Order Tracking** - Status updates from pending to delivered
- **Responsive Navigation** - Mobile-friendly menu and search
- **Product Detail Pages** - With images, specifications, and reviews

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful SVG icons

## 🔄 Integration with Backend

The frontend connects to the backend API at `http://localhost:5000/api` by default. All CRUD operations, authentication, and order processing are handled through the backend.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile phones

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.