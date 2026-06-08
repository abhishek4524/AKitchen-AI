# AKitchen AI – Project Feature Overview

## 🎯 Core Purpose
- Provide AI‑assisted cooking assistance (recipe generation, nutrition analysis, leftover ideas, budget cooking, grocery planning, meal planning, etc.)
- Seamlessly support **anonymous guest** usage with a single AI action before prompting login.
- Track guest usage to enforce login after the first use.

## 🔑 Guest Usage Flow
1. **Visit site** – a `guest_id` cookie is created via `client/src/utils/guest.js`.
2. **Use an AI feature** (e.g., Recipe AI, Nutrition AI).
   - Frontend sends `x‑guest‑id` header.
   - Backend (`server/utils/guestUsage.js`) increments usage count in MongoDB.
3. **Usage limit** – if `usageCount > 1`, the API responds with `{requiresLogin:true}` and the UI opens a login modal.
4. **Login** – Google OAuth is started with the `guestId` query param.
5. **Post‑login** – guest usage is merged into the user account, the cookie is cleared, and a JWT is stored for subsequent authenticated requests.

## 🤖 AI Features (Server)
- **Recipe Generation** – `POST /api/ai/generate-recipe` (`server/controller/aiController.js`).
  - Calls `services/aiService` for LLM‑generated recipe.
  - Retrieves an image via `services/imageService`.
  - Stores recipe in MongoDB, links to the authenticated user if present.
- **Nutrition Analysis** – `POST /api/ai/nutrition` (`server/controller/nutritionController.js`).
  - Provides macro/micronutrient breakdown for input ingredients.
- **Leftover Generator**, **Budget Cooking**, **Meal Planner**, **Grocery List** – separate endpoints in `server/controller/*` that apply AI to specific cooking scenarios.

## 🛡️ Authentication & Authorization
- **Google OAuth** – `/auth/google` route (`server/routes/auth.js`).
- **JWT** – issued after successful Google login, stored in `localStorage`/cookies, used for protected API calls.
- **Guest‑to‑User migration** – merges `GuestUsage` into user document on login.

## 📊 Admin Panel (Server + Client)
- **Admin Dashboard** (`admin` folder) provides:
  - User management (view, deactivate, role assignment).
  - Usage analytics (guest vs. authenticated calls).
  - Ability to manually reset guest usage limits.
- **Server‑side utilities** for admin actions live under `admin/` (e.g., scripts for DB maintenance).

## 🖥️ Front‑End (React + Vite)
- **Pages & Components** (under `client/src/pages` & `client/src/components`):
  - `AIRecipe.jsx` – interactive recipe generator UI.
  - `NutritionAIPage.jsx` – nutrition analysis tool.
  - `MealPlanner.jsx`, `BudgetCooking.jsx`, `LeftoverGenerator.jsx` – specialized cooking helpers.
  - `GroceryPage.jsx` – auto‑generated grocery list from meal plans.
  - `Dashboard.jsx`, `Explore.jsx`, `CommunityFeed.jsx` – community & discovery features.
  - `Login.jsx`, `Signup.jsx`, `LoginRequiredModal.jsx` – authentication flow with guest handling.
  - `Profile.jsx`, `Settings.jsx` – user profile & preferences.
  - `AdminPanel.jsx` – UI for admin tasks (visible only to admin users).
- **Utility modules** (`client/src/utils`):
  - `guest.js` – cookie handling, guest‑ID generation, usage tracking, Google auth URL builder.
  - `api.js` – thin wrapper around fetch calls with JWT handling.
- **Styling** – Tailwind CSS with a custom dark‑mode theme for a premium look.

## 🗄️ Data Models (MongoDB)
- **User** – email, Google ID, JWT secret, `createdRecipes`, preferences.
- **Recipe** – title, ingredients, steps, generated image URL, `createdBy` reference, `aiGenerated` flag.
- **GuestUsage** – `guestId`, `usageCount`, timestamps, `requiresLogin` flag.

## 📦 Project Structure
```
AKitchen AI (root)
├─ admin/                # admin scripts & UI
├─ client/               # React front‑end (Vite)
│   ├─ src/
│   │   ├─ components/   # UI components
│   │   ├─ pages/       # route pages
│   │   └─ utils/       # helpers (guest, API, etc.)
│   └─ public/          # static assets
├─ server/               # Express backend
│   ├─ controller/       # route handlers (ai, auth, usage)
│   ├─ models/          # Mongoose schemas (User, Recipe, GuestUsage)
│   ├─ services/        # AI & image services
│   ├─ utils/           # guest usage tracking
│   └─ routes/          # Express routers
└─ info.md               # ← this feature summary
```

## 🚀 Getting Started (Quick Summary)
1. `npm install` in both `client` and `server`.
2. Set up `.env` with MongoDB URI, Google OAuth credentials, JWT secret.
3. Run `npm run dev` in `client` and `npm start` in `server`.
4. Open the app, try a recipe generation as a guest, then log in to unlock unlimited AI usage.

---
*All features are built to be discoverable, premium‑styled, and ready for further extension (e.g., adding new AI cooking assistants or deeper analytics).*
