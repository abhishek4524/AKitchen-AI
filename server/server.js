const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./config/db")
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
res.send("AKitchenAI API running");
});

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI missing in env");
}

app.listen(process.env.PORT || 5000, ()=>{
console.log("Server running on port " + (process.env.PORT || 5000));
});