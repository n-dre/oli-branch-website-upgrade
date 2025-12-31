# Google Sheets Integration Setup

## Overview
This guide will help you set up Google Sheets integration for user registration.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Oli-Branch User Registrations"
4. Set up columns in row 1:
   - A: Timestamp
   - B: Full Name
   - C: Email
   - D: Business Name
   - E: Business Type
   - F: Status

## Step 2: Get Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/1O-HygRiu50iHATb0h6pj_IEulairqWrAS5Jz0yVyf9k/edit?gid=1237725089#gid=1237725089`
3. Copy the 1O-HygRiu50iHATb0h6pj_IEulairqWrAS5Jz0yVyf9k/edit?gid=1237725089#gid=1237725089 part - this is your Sheet ID

## Step 3: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials (API Key)
5. Copy the API Key

## Step 4: Update Code

In `signup.html`, replace:
- `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID
- `YOUR_GOOGLE_API_KEY` with your actual API Key

## Step 5: Test Registration

1. Open `signup.html` in browser
2. Fill out registration form
3. Submit
4. Check Google Sheet for new entry

## Alternative: Simple Registration (No Google Sheets)

If you don't want to use Google Sheets, the current system works with localStorage:
- Users can register
- Data is stored locally
- Users get access to dashboard
- Demo accounts still work

## Demo Accounts (Always Work)

**User Account:**
- Email: user@demo.com
- Password: demo123
- Access: User Dashboard

**Admin Account:**
- Email: admin@demo.com
- Password: admin123
- Access: Admin Dashboard

## Troubleshooting

If registration doesn't work:
1. Check browser console for errors
2. Verify all required fields are filled
3. Try demo accounts to test dashboard access
4. Ensure JavaScript is enabled in browser

## Files Created

- `signup.html` - Registration form
- `login.html` - Login form (updated with sign-up link)
- `user-dashboard.html` - User dashboard
- `admin-dashboard.html` - Admin dashboard

All files are now in `/mnt/okcomputer/output/` and ready to use!