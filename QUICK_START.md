# 🚀 Admin Dashboard - Quick Start (5 Minutes)

## 📋 Checklist

### ✅ Step 1: Create Admin User (30 seconds)

```bash
cd f:\AKitchen\ ai\server
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

---

### ✅ Step 2: Start Server (Terminal 1)

```bash
cd f:\AKitchen\ ai\server
npm start
```

**Expected Output:**
```
Server running on port 5000
```

---

### ✅ Step 3: Start Admin Dashboard (Terminal 2)

```bash
cd f:\AKitchen\ ai\admin
npm install
npm run dev
```

**Expected Output:**
```
  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### ✅ Step 4: Open Admin Dashboard

1. Open browser → `http://localhost:5173`
2. You'll see the **Login Page**
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click **Login**

---

## 🎯 What You Can Do Now

### 📊 Dashboard
- View total recipes (AI + Original)
- View total users
- View grocery items count
- See system status

### 🍳 Recipes Manager
- View all recipes in a table
- Search recipes
- Filter by type
- Delete recipes

### 👥 Users Manager
- View all users
- Search users
- View user details
- See saved/created recipes

---

## 🔑 Admin Credentials

```
Email:    admin@example.com
Password: admin123
```

---

## 📱 All Services URL

| Service | URL | Port | Command |
|---------|-----|------|---------|
| Server | http://localhost:5000 | 5000 | `npm start` |
| Admin | http://localhost:5173 | 5173 | `npm run dev` |
| Client | http://localhost:5174 | 5174 | `npm run dev` |

---

## ❌ Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot connect to server" | Make sure server is running on port 5000 |
| "Login fails" | Check if admin user was created |
| "Page won't load" | Clear browser cache, restart dev server |
| "Cannot see data" | Verify MongoDB is running |

---

## 🎨 Admin Features Overview

### 🔐 **Authentication**
- Email/Password login
- JWT token-based
- Auto logout

### 📊 **Dashboard**
- Live statistics
- Quick stats cards
- System info

### 🍳 **Recipe Management**
- View recipes table
- Search & filter
- Delete recipes
- See AI vs Original

### 👥 **User Management**
- User list
- User profiles
- Saved recipes count
- Created recipes count

---

## 💡 Key Files

```
admin/src/
├── App.jsx           → Routes & Auth
├── pages/
│   ├── AdminLogin.jsx      → Login
│   ├── Dashboard.jsx       → Stats
│   ├── RecipesManager.jsx  → Manage recipes
│   └── UsersManager.jsx    → Manage users
└── utils/api.js      → API calls
```

---

## 🔄 API Endpoints Used

```
POST   /api/admin/auth/login        → Login
GET    /api/admin/users             → Get users
GET    /api/recipes                 → Get recipes
DELETE /api/recipes/:id             → Delete recipe
GET    /api/grocery/items           → Get items
```

---

## ⚡ Performance Tips

- Data loads on page load
- Search is instant (client-side)
- Filters are fast
- Delete actions are confirmed

---

## 🎓 Learn More

For detailed information:
- `ADMIN_IMPLEMENTATION_SUMMARY.md` - Complete overview
- `ADMIN_SETUP.md` - Detailed setup guide
- `admin/README.md` - Admin dashboard docs

---

## 📞 Support

If something doesn't work:

1. Check if server is running: `http://localhost:5000`
2. Check MongoDB connection
3. Verify admin user exists in database
4. Check browser console for errors (F12)
5. Check server logs for errors

---

**You're all set! Happy managing! 🎉**

Next time you need to start services:
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd admin && npm run dev

# Terminal 3 (optional)
cd client && npm run dev
```

Visit: `http://localhost:5173` and login!
