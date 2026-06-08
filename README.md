# AKitchen-AI

## Guest AI Usage Flow

AKitchen AI allows one anonymous AI action before asking the visitor to log in.

1. User opens the website.
2. Frontend creates a `guest_id` cookie in `client/src/main.jsx` via `client/src/utils/guest.js`.
3. Guest uses an AI feature:
   - Recipe AI sends `x-guest-id` to `POST /api/ai/generate-recipe`; the backend increments MongoDB usage once before generating.
   - Nutrition AI calls `POST /api/usage/track` with feature `nutrition_ai`.
4. MongoDB `GuestUsage.usageCount` increments.
5. If `usageCount > 1`, the feature opens the login modal instead of continuing.
6. Google login is started with `guestId` and `returnTo`.
7. On Google callback, backend merges guest usage into the user account, deletes the guest usage record, and redirects back to the original page with a JWT token.

Main files:

- `client/src/utils/guest.js`
- `client/src/components/LoginRequiredModal.jsx`
- `client/src/components/AuthRedirectHandler.jsx`
- `client/src/pages/AIRecipe.jsx`
- `client/src/pages/NutritionAIPage.jsx`
- `server/utils/guestUsage.js`
- `server/controller/aiController.js`
- `server/controller/usageController.js`
- `server/routes/auth.js`
