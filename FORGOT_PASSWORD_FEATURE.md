# Forgot Password with OTP Feature

## Overview
This feature implements a forgot password functionality that allows users to reset their password using an OTP (One-Time Password) sent to their email address. This enhances security and provides a better user experience for users who have forgotten their passwords.

## Backend Changes

### 1. User Model (models/User.js)
- Added `passwordResetOTP` field to store the OTP code for password reset
- Added `passwordResetOTPExpires` field to store the OTP expiration time

### 2. Auth Controller (controllers/authController.js)
- Added `forgotPassword` function to:
  - Generate a 6-digit OTP for password reset
  - Set OTP expiration time (10 minutes)
  - Store OTP and expiration time in the user document
  - Send OTP via email using the new email service function
  
- Added `resetPassword` function to:
  - Verify the OTP provided by the user
  - Check if OTP is correct and not expired
  - Update the user's password if OTP is valid
  - Clear OTP fields after successful password reset

### 3. Email Service (utils/emailService.js)
- Added `sendPasswordResetOTP` function to send password reset OTP emails
- Created a new email template specifically for password reset OTP

### 4. Auth Routes (routes/authRoutes.js)
- Added new endpoints:
  - `POST /api/auth/forgot-password` - Send password reset OTP
  - `POST /api/auth/reset-password` - Reset password with OTP

## Frontend Changes

### 1. API Service (lib/apiService.ts)
- Added `forgotPassword` function to call the forgot password endpoint
- Added `resetPassword` function to call the reset password endpoint

### 2. Login Page (app/login/page.tsx)
- Improved error handling for incorrect passwords
- Changed "Forgot password?" link to navigate to the forgot password page
- Added specific error message for wrong passwords

### 3. Forgot Password Page (app/forgot-password/page.tsx)
- Created a new page with a three-step process:
  1. User enters email to receive password reset OTP
  2. User enters OTP received via email
  3. User sets a new password
- Added resend OTP functionality with a 60-second cooldown timer
- Added proper error and success messaging

## Security Features

1. **OTP Expiration**: Password reset OTPs expire after 10 minutes for security
2. **Resend Cooldown**: Users must wait 60 seconds before requesting a new OTP
3. **OTP Clearing**: OTP is cleared from the database after successful password reset
4. **Unique Email Validation**: System checks if email exists before sending OTP

## User Experience

1. **Clear Instructions**: Users are guided through the password reset process
2. **Error Handling**: Proper error messages for invalid OTP, expired OTP, password mismatch, etc.
3. **Resend Option**: Users can easily request a new OTP if needed
4. **Visual Feedback**: Success and error messages with appropriate styling
5. **Timer for Resend**: Visual countdown for resend cooldown period
6. **Password Validation**: Ensures new password meets minimum requirements

## API Endpoints

- `POST /api/auth/forgot-password` - Send password reset OTP to email
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/login` - Login user (improved error messages)

## Testing

The implementation has been tested to ensure:
- All backend files have correct syntax
- New API endpoints function correctly
- Password reset workflow works as expected
- Error handling is properly implemented
- OTP expiration works correctly
- Resend functionality works with cooldown