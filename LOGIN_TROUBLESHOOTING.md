# 🔧 Admin Login Troubleshooting & Debug Guide

## 🚨 Login Not Working? Follow These Steps:

### **Step 1: Verify Server is Running**

```bash
cd "f:\AKitchen ai\server"
npm start
```

**Expected Output:**
```
✅ Connected to MongoDB
Server running on port 5000
```

If you see any errors, stop here and fix them.

---

### **Step 2: Create/Verify Admin User**

```bash
cd "f:\AKitchen ai\server"
node scripts/createAdmin.js
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Admin user created successfully!

📋 Admin Credentials:
   Email: admin@example.com
   Password: admin123
```

**If you see:**
- ✅ "Admin user already exists!" → Good! Admin is in database
- ❌ "MongoDB connection failed!" → Start MongoDB
- ❌ "Error" → Check MongoDB is running

---

### **Step 3: Check Admin User in Database**

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Go to `akitchen` database → `users` collection
4. Look for a user with email `admin@example.com`
5. Verify these fields:
   - `email`: admin@example.com
   - `password`: admin123
   - `isAdmin`: true

**If admin user is missing:**
- Run Step 2 again
- Make sure MongoDB saved the data

**If fields are wrong:**
- Delete the record
- Run Step 2 again

---

### **Step 4: Start Admin Dashboard**

```bash
cd "f:\AKitchen ai\admin"
npm run dev
```

**Expected Output:**
```
✅ VITE v7.3.1 ready

➜  Local:   http://localhost:5173/
```

---

### **Step 5: Test Login**

1. Open browser: `http://localhost:5173`
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "Login"

4. **Open Browser Console** (Press F12 → Console tab)

**Look for these logs:**

✅ **Success:**
```
🔐 Sending login request to server...
📡 Response status: 200
📥 Response data: {success: true, message: "Login successful", token: "...", user: {...}}
✅ Login successful, navigating to dashboard...
```

❌ **Error:**
```
❌ Login error: Invalid email or password
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Invalid email or password"**

**Causes:**
1. Admin user doesn't exist in database
2. Email doesn't match
3. Password doesn't match
4. User is not marked as admin

**Fixes:**
```bash
# 1. Verify MongoDB connection
mongo
use akitchen
db.users.find({email: "admin@example.com"})

# 2. If not found, create it
node scripts/createAdmin.js

# 3. Check the record
db.users.findOne({email: "admin@example.com"})

# 4. Should show:
{
  _id: ObjectId(...),
  email: "admin@example.com",
  password: "admin123",
  isAdmin: true,
  ...
}
```

---

### **Issue 2: "Cannot connect to server"**

**Causes:**
1. Server not running
2. Wrong port
3. CORS issues

**Fixes:**
```bash
# Check if server is running
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Kill any process on port 5000
taskkill /PID [PID] /F

# Start server fresh
cd server
npm start
```

---

### **Issue 3: "No token received from server"**

**Causes:**
1. Login successful but response format wrong
2. JWT generation failed
3. Server error

**Fixes:**

Look at **Server Console** for errors:
```
❌ Login error: ...
```

**If you see "Server error":**
1. Check MongoDB connection
2. Check JWT_SECRET in .env
3. Restart server

---

### **Issue 4: Login works but won't navigate to dashboard**

**Causes:**
1. Token not stored
2. Auth context issue
3. Routing issue

**Fixes:**
```javascript
// Check browser console
localStorage.getItem('adminToken')  // Should return a token

// Should see in console:
✅ Login successful, navigating to dashboard...
```

---

## 🔍 Debugging: Check Server Logs

When you login, **server should show:**

✅ **Successful login:**
```
🔐 Login attempt: {email: "admin@example.com", passwordLength: 8}
👤 User found: Yes
🔍 User details: {isAdmin: true, hasPassword: true}
✅ Login successful for: admin@example.com
```

❌ **Failed attempts:**
```
❌ User not found in database
❌ Password mismatch
❌ User is not admin
```

---

## 🔐 Verify Admin Account Details

### **MongoDB CLI Check:**

```javascript
// Connect to MongoDB
mongo

// Use akitchen database
use akitchen

// Check admin user
db.users.find({email: "admin@example.com"})

// Output should show:
{
  _id: ObjectId("..."),
  name: "Admin",
  email: "admin@example.com",
  password: "admin123",
  isAdmin: true,
  role: "admin",
  createdAt: ISODate("..."),
  __v: 0
}
```

### **If output shows `isAdmin: false`:**

Fix it:
```javascript
db.users.updateOne(
  {email: "admin@example.com"},
  {$set: {isAdmin: true}}
)
```

---

## 📋 Complete Setup Checklist

- [ ] **MongoDB running**: `mongod` command or MongoDB service
- [ ] **Server started**: `cd server && npm start`
- [ ] **Admin user created**: `node scripts/createAdmin.js`
- [ ] **Admin exists in DB**: Verified with Compass or CLI
- [ ] **isAdmin = true**: Checked in database
- [ ] **Admin panel started**: `cd admin && npm run dev`
- [ ] **Opened http://localhost:5173**
- [ ] **Entered correct email**: admin@example.com
- [ ] **Entered correct password**: admin123
- [ ] **Clicked Login**
- [ ] **Checked browser console**: (F12)
- [ ] **Checked server console**: Look for logs

---

## 🚀 Quick Reset (If Everything is Broken)

```bash
# 1. Stop all services (Ctrl+C in all terminals)

# 2. Delete admin user from database
mongo
use akitchen
db.users.deleteOne({email: "admin@example.com"})

# 3. Recreate admin
cd server
node scripts/createAdmin.js

# 4. Start services again
# Terminal 1:
npm start

# Terminal 2:
cd admin
npm run dev

# 5. Try login again
# http://localhost:5173
# admin@example.com / admin123
```

---

## 📞 Need More Help?

If still not working, provide:

1. **Server console output**:
   ```
   Paste what you see when you try to login
   ```

2. **Browser console output** (F12):
   ```
   Paste the error messages
   ```

3. **Database check result**:
   ```
   db.users.findOne({email: "admin@example.com"})
   ```

4. **What you tried**:
   ```
   List all steps you've already done
   ```

---

## ✅ Success Indicators

You'll know login is working when:

✅ Server logs show: "✅ Login successful for: admin@example.com"
✅ Browser console shows: "✅ Login successful, navigating to dashboard..."
✅ You see the Dashboard page
✅ You can see statistics (recipes, users, items counts)

---

**You're ready to troubleshoot! 🎯**
