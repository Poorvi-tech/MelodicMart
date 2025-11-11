# Email Verification with OTP Feature

## Overview
This feature implements email verification with OTP (One-Time Password) for user registration to enhance security. Users must verify their email address before they can log in to their account.

## Backend Changes

### 1. User Model (models/User.js)
- Added `emailVerificationOTP` field to store the OTP code
- Added `emailVerificationOTPExpires` field to store the OTP expiration time
- The `isVerified` field already existed and is used to track verification status

### 2. Auth Controller (controllers/authController.js)
- Modified the `register` function to:
  - Generate a 6-digit OTP
  - Set OTP expiration time (10 minutes)
  - Store OTP and expiration time in the user document
  - Send OTP via email using the updated email service
  - Return a success message without automatically logging in the user
  
- Added `verifyOTP` function to:
  - Verify the OTP provided by the user
  - Check if OTP is correct and not expired
  - Mark user as verified if OTP is valid
  - Clear OTP fields after successful verification
  - Return user data and JWT token for automatic login
  
- Added `resendOTP` function to:
  - Generate a new OTP for users who didn't receive the original
  - Update the user document with the new OTP and expiration time
  - Send the new OTP via email
  
- Modified the `login` function to:
  - Check if the user is verified before allowing login
  - Return an error message if the user is not verified

### 3. Email Service (utils/emailService.js)
- Updated `sendConfirmationEmail` function to:
  - Accept an optional OTP parameter
  - Send a different email template when OTP is provided (for registration)
  - Send the original email template when OTP is not provided (for contact forms)
  
### 4. Auth Routes (routes/authRoutes.js)
- Added new endpoints:
  - `POST /api/auth/verify-otp` - Verify email with OTP
  - `POST /api/auth/resend-otp` - Resend verification OTP

## Frontend Changes

### 1. API Service (lib/apiService.ts)
- Added `verifyOTP` function to call the verify OTP endpoint
- Added `resendOTP` function to call the resend OTP endpoint

### 2. Registration Page (app/register/page.tsx)
- Implemented a two-step registration process:
  1. User fills registration form and submits
  2. User receives OTP via email and enters it for verification
- Added OTP input field with proper styling
- Added resend OTP functionality with a 60-second cooldown timer
- Added navigation between registration form and OTP verification
- Added proper error and success messaging

### 3. Login Page (app/login/page.tsx)
- Added handling for unverified users:
  - Shows a "Resend Verification Email" button when login fails due to unverified email
  - Added resend OTP functionality on the login page

## Security Features

1. **Unique Email Enforcement**: The system ensures each email can only be registered once
2. **OTP Expiration**: OTPs expire after 10 minutes for security
3. **Resend Cooldown**: Users must wait 60 seconds before requesting a new OTP
4. **Email Verification Required**: Users cannot log in until they verify their email
5. **OTP Clearing**: OTP is cleared from the database after successful verification

## User Experience

1. **Clear Instructions**: Users are guided through the verification process
2. **Error Handling**: Proper error messages for invalid OTP, expired OTP, etc.
3. **Resend Option**: Users can easily request a new OTP if needed
4. **Visual Feedback**: Success and error messages with appropriate styling
5. **Timer for Resend**: Visual countdown for resend cooldown period

## API Endpoints

- `POST /api/auth/register` - Register new user (returns success message, not token)
- `POST /api/auth/verify-otp` - Verify email with OTP (returns token on success)
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/login` - Login user (only works for verified users)

## Testing

The implementation has been tested to ensure:
- All backend files have correct syntax
- New API endpoints function correctly
- Email verification workflow works as expected
- Error handling is properly implemented
- User cannot login without email verification
- OTP expiration works correctly
- Resend functionality works with cooldown