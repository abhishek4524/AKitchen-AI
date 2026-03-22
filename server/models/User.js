const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

 googleId:String,
 name:String,
 email:{
  type:String,
  unique:true
 },
 picture:String,
 role:{
  type:String,
  default:"user"
 },
 plan:{
  type:String,
  default:"free"
 },
 settings:{
  theme:{
   type:String,
   default:"light"
  },
  notifications:{
   type:Boolean,
   default:true
  }
 },
 createdAt:{
  type:Date,
  default:Date.now
 }

});

module.exports = mongoose.model("User", UserSchema)