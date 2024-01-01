import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
  {
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
    },
    coverimage: {
      type: String, //cloudinary url
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre('save',async function(){
  await bcrypt.hash(this.password,process.env.SALT_ROUNDS)
  
})
userSchema.method("accessToken",async function(){
  const payload={
    username:this.username,
    email:this.email,
    fullname:this.fullname
  }
  await jwt.sign(payload,process.env.ACCESSTOKEN_KEY,{expiresIn:process.env.ACCESSTOKEN_EXP},(err,token)=>{
    if(err)
    return console.log("error occured generating token");
    console.log("token generated");
  })
  
})
userSchema.method("refreshToken",async function(){
  const payload={
    username:this.username,
    email:this.email,
    fullname:this.fullname
  }
  await jwt.sign(payload,process.env.REFRESHTOKEN_KEY,{expiresIn:process.env.REFRESHTOKEN_EXP})
  
})
export const User = mongoose.model("User", userSchema);

