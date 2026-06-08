# Signup Page - Troubleshooting Guide

## Issues Fixed ✅
1. **Social signup buttons now work** - Google redirects to OAuth, GitHub/Facebook show "coming soon"
2. **Improved error messages** - More detailed and helpful error display
3. **Better error handling** - Network errors now show helpful debugging info
4. **Fixed success message** - Changed from misleading "verification" to "redirecting"
5. **Better error visibility** - Larger, more prominent error box with context

---

## Common Issues & Solutions

### ❌ "Failed to fetch" Error
**Cause**: Backend server is not running
**Solution**:
```bash
# In a new terminal, go to server directory
cd server
node server.js
# or if you use npm start
npm start
```
Server should run on `http://localhost:5000`

### ❌ "Email already registered" Error
**Cause**: Email is already in the database
**Solution**: 
- Use a different email address
- Or delete the user from MongoDB database

### ❌ "Password is too weak" Error
**Cause**: Password doesn't meet requirements
**Solution**: Password must have:
- ✅ At least 8 characters
- ✅ Lowercase letters (a-z)
- ✅ Uppercase letters (A-Z)
- ✅ Numbers (0-9)
Example: `MyPassword123!`

### ❌ "Passwords do not match" Error
**Cause**: Confirmation password doesn't match password
**Solution**: 
- Verify both passwords are identical
- Check for extra spaces or typos

### ❌ Form won't submit
**Cause**: Validation errors or missing field
**Solution**:
- Check all fields are filled
- Ensure all validation errors (shown in red) are fixed
- Check terms and conditions checkbox

### ❌ Redirects to login instead of profile
**Cause**: Could be JWT token issue
**Solution**:
- Check browser console for errors (F12 → Console)
- Check that token is saved in localStorage
- Verify `/profile` route exists in your app

---

## Debugging Steps

### Step 1: Check Browser Console
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Look for any error messages
4. Check **Network** tab to see if request went through

### Step 2: Verify Backend is Running
```bash
# Test if backend is responding
curl http://localhost:5000/auth/me
# or in browser: http://localhost:5000/health
```

### Step 3: Check Environment Variables
Create `.env` file in client directory:
```
VITE_API_URL=http://localhost:5000
```

### Step 4: Check API Endpoint
1. Open browser Network tab (F12 → Network)
2. Click "Create Account"
3. Look for `auth/register` request
4. Check Response tab for actual error from server
5. Check Status code:
   - 201 = Success ✅
   - 400 = Bad request (validation error)
   - 409 = Email already exists
   - 500 = Server error

### Step 5: Check MongoDB Connection
Backend won't work if MongoDB is not connected:
```bash
# Server logs should show:
# "Connected to MongoDB" or similar
```

---

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] MongoDB is connected
- [ ] Client .env has VITE_API_URL set correctly
- [ ] Browser console has no errors
- [ ] All form fields are filled correctly
- [ ] Password meets requirements
- [ ] Email is unique (not already registered)
- [ ] Network request shows 201 status code
- [ ] Token is saved in localStorage
- [ ] Redirects to /profile after signup

---

## Quick Test Command

Test the backend signup endpoint directly:
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    ...
  }
}
```

---

## Frontend Changes Made

### 1. Fixed Social Signup
**Before**: Just logged to console
**After**: 
- Google redirects to OAuth flow
- GitHub/Facebook show "coming soon"

### 2. Improved Error Messages
**Before**: Small, easy to miss error box
**After**: Large, prominent error box with debugging info

### 3. Better Error Handling
**Before**: Generic error messages
**After**: Specific, helpful messages with context

### 4. Enhanced Success Message
**Before**: Said "verification" but didn't verify
**After**: Clear "redirecting" message

---

## Server Requirements

Make sure your `server/.env` has these:
```
MONGODB_URI=mongodb://localhost:27017/akitchen
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
CLIENT_URL=http://localhost:5174
API_PORT=5000
NODE_ENV=development
```

---

## Still Not Working?

1. **Check server logs** - Look for errors in terminal where server runs
2. **Check network tab** - See actual response from server
3. **Check console** - Look for JavaScript errors
4. **Clear cache** - Hard refresh browser (Ctrl+Shift+R)
5. **Check MongoDB** - Ensure database is connected
6. **Restart everything** - Kill and restart both client and server

---

## For GitHub Issues

If you still have problems, include:
1. Screenshot of error message
2. Browser console error (F12 → Console)
3. Network tab response (F12 → Network → Click auth/register)
4. Server terminal output (what shows when you run `npm start`)
5. Steps to reproduce the issue
