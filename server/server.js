const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const connectDB = require("./config/db")
require("dotenv").config();
require("./config/passport");
connectDB();

const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/user")
const recipeRoutes = require("./routes/recipeRoutes")
const aiRoutes = require("./routes/aiRoutes");

const itemRoutes = require('./routes/itemRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ai", aiRoutes);

app.use('/api/grocery', itemRoutes);
app.use('/api/grocery', suggestionRoutes);
app.use('/api/reviews', reviewRoutes);

// Admin auth in adminRoutes handles /api/admin/auth/login to keep a single source of truth.
// app.use('/api/admin/auth', require('./routes/adminAuth'));

app.listen(process.env.PORT || 5000, ()=>{
  console.log("Server running on port " + (process.env.PORT || 5000));
});