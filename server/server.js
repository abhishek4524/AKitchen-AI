const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();
require("./config/passport");

const connectDB = require("./config/db");
connectDB();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipeRoutes");
const aiRoutes = require("./routes/aiRoutes");

const itemRoutes = require("./routes/itemRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();


// ✅ CORS CONFIG (SMART + FUTURE PROOF)
const allowedOrigins = [
  "https://akitchen.vercel.app",
  "https://akitchenai.in",
  "https://www.akitchenai.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow main domain + all vercel preview domains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// ✅ Middlewares
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/grocery", itemRoutes);
app.use("/api/grocery", suggestionRoutes);
app.use("/api/reviews", reviewRoutes);


// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});