# AKitchen Admin Dashboard

A comprehensive admin panel for managing recipes, users, and grocery items in the AKitchen application.

## Features

✨ **Dashboard Overview**
- Real-time statistics on recipes, users, and grocery items
- Quick access to management sections
- System information display

🍳 **Recipes Management**
- View all recipes (original and AI-generated)
- Search and filter recipes by type and cuisine
- Delete recipes with confirmation
- Visual distinction between AI-generated and original recipes

👥 **Users Management**
- View all registered users
- Search users by name or email
- Detailed user profiles with saved recipes count
- User statistics and analytics

🔐 **Authentication**
- Secure login with JWT tokens
- Protected routes
- Automatic logout

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Server running on `http://localhost:5000`

### Installation

```bash
cd admin
npm install
```

### Running the Admin Dashboard

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Default Login Credentials

For testing purposes:
- **Email**: admin@example.com
- **Password**: admin123

**Note**: You need to create an admin user in your server database.

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx      # Main layout wrapper
│   │   └── Sidebar.jsx          # Navigation sidebar
│   ├── pages/
│   │   ├── AdminLogin.jsx       # Login page
│   │   ├── Dashboard.jsx        # Overview dashboard
│   │   ├── RecipesManager.jsx   # Recipes management
│   │   └── UsersManager.jsx     # Users management
│   ├── utils/
│   │   └── api.js               # API helper functions
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind CSS
```

## Technologies Used

- **React 19** - UI library
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool

## Troubleshooting

### "Cannot connect to API"
- Ensure the server is running on port 5000
- Check if CORS is enabled on the server

### "Login fails"
- Verify the admin user exists in the database
- Check server logs for authentication errors

For more details, visit the main repository README.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
