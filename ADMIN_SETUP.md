# Admin Panel Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install admin dependencies
cd admin
npm install

# Install server dependencies (if not already done)
cd ../server
npm install
```

### 2. Create Admin User

The admin panel requires an admin user in the database. You can create one using MongoDB directly or create a script.

#### Option A: Using MongoDB Compass or CLI

Connect to your MongoDB database and insert an admin user:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "admin123",
  isAdmin: true,
  role: "admin",
  createdAt: new Date()
})
```

#### Option B: Using Node Script

Create a file `server/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/akitchen');
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
      role: 'admin',
    });

    console.log('✅ Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
```

Then run:
```bash
node server/scripts/createAdmin.js
```

### 3. Start the Services

```bash
# Terminal 1: Start Server
cd server
npm start
# Server will run on http://localhost:5000

# Terminal 2: Start Admin Dashboard
cd admin
npm run dev
# Admin will run on http://localhost:5173

# Terminal 3 (Optional): Start Client
cd client
npm run dev
# Client will run on http://localhost:5174
```

### 4. Login to Admin Dashboard

1. Navigate to `http://localhost:5173`
2. Enter the admin credentials:
   - **Email**: admin@example.com
   - **Password**: admin123
3. Click "Login"

## Admin Dashboard Features

### 📊 Dashboard
- Real-time statistics
- Total recipes count (AI + Original)
- Total users count
- Total grocery items count
- Quick action buttons

### 🍳 Recipes Manager
- View all recipes in a table
- Filter by recipe type (All, AI Generated, Original)
- Search recipes by title or cuisine
- Delete recipes with confirmation
- Visual indicators for recipe type and details

### 👥 Users Manager
- View all registered users
- Search users by name or email
- View detailed user profiles
- See saved and created recipes count
- User statistics

## Database Schema Updates

The following fields were added to the User model:

```javascript
{
  password: String,           // For admin authentication
  isAdmin: Boolean,           // To identify admin users
  // ... existing fields
}
```

## API Endpoints for Admin

### Authentication
- `POST /api/admin/auth/login` - Admin login (public)

### Users (Protected)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get specific user

### Recipes (Protected)
- `GET /api/recipes` - Get all recipes
- `DELETE /api/recipes/:id` - Delete recipe

### Grocery Items (Protected)
- `GET /api/grocery/items` - Get all items

## Security Notes

⚠️ **Before going to production:**

1. **Change default password** for the admin user
2. **Enable password hashing** using bcrypt
3. **Add role-based access control** (RBAC)
4. **Implement 2FA** for admin accounts
5. **Set environment variables** properly
6. **Use HTTPS** instead of HTTP
7. **Add request rate limiting**
8. **Implement audit logging** for admin actions

### Example: Hash Passwords with bcrypt

```bash
npm install bcryptjs
```

Update `adminController.js`:

```javascript
const bcrypt = require('bcryptjs');

// During login
const isValid = await bcrypt.compare(password, user.password);

// During user creation
const hashedPassword = await bcrypt.hash(password, 10);
```

## Troubleshooting

### 1. "Cannot connect to server"
- Ensure server is running on port 5000
- Check if MongoDB is connected
- Verify `.env` variables

### 2. "Login fails with 404"
- Ensure admin user exists in database
- Check if `/api/admin/auth/login` endpoint is properly registered
- Verify server `server.js` imports adminRoutes

### 3. "Styles not loading in admin"
- Clear browser cache
- Rebuild: `npm run build`
- Check if Tailwind CSS is configured

### 4. "Cannot fetch users/recipes"
- Verify admin token is being passed
- Check server authentication middleware
- Ensure user has admin permissions

### 5. "CORS errors"
- Verify CORS is enabled in server (`server.js`)
- Check API URLs in `admin/src/utils/api.js`

## Customization

### Adding New Admin Routes

1. Create controller in `server/controller/`
2. Create routes in `server/routes/`
3. Update `server.js` to include the new routes
4. Add API functions in `admin/src/utils/api.js`
5. Create page component in `admin/src/pages/`

### Example: Adding Category Management

```javascript
// server/controller/categoryController.js
exports.getAllCategories = async (req, res) => { /* ... */ };

// server/routes/categoryRoutes.js
router.get('/categories', getAllCategories);

// admin/src/utils/api.js
export const categoriesAPI = {
  getAll: () => apiCall('/admin/categories'),
};

// admin/src/pages/CategoriesManager.jsx
const CategoriesManager = () => { /* ... */ };
```

## Future Enhancements

- [ ] User role management (Admin, Moderator, Editor)
- [ ] Recipe creation/editing form in admin panel
- [ ] User account management (create, edit, delete)
- [ ] Analytics and reports dashboard
- [ ] Audit log for admin actions
- [ ] Two-factor authentication (2FA)
- [ ] Dark mode support
- [ ] Admin notifications system
- [ ] Batch operations (delete multiple recipes)
- [ ] Content moderation tools

## Support

For issues or questions, refer to:
- Main README: `/README.md`
- API Documentation: `/server/README.md`
- Client Documentation: `/client/README.md`

---

**Last Updated**: March 23, 2026
