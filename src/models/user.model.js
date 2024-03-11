import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
userSchema.method("checkPassword", async function (enteredPassword) {
  const result = await bcrypt.compare(enteredPassword, this.password);
  return result;
});

userSchema.method("accessTokenMethod", function () {
  const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    fullname: this.fullname,
  };
  return jwt.sign(payload, process.env.ACCESSTOKEN_KEY, {
    expiresIn: process.env.ACCESSTOKEN_EXP,
  });
});
userSchema.method("refreshTokenMethod", function () {
  const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    fullname: this.fullname,
  };
  return jwt.sign(payload, process.env.REFRESHTOKEN_KEY, {
    expiresIn: process.env.REFRESHTOKEN_EXP,
  });
});
export const User = mongoose.model("User", userSchema);
// $2b$12$b8UYteYrdesIEUCLfrAyCe2QlUhg0gYQuNXJcZXUNRLErJnDDk4Ki
// $2b$12$b8UYteYrdesIEUCLfrAyCe2QlUhg0gYQuNXJcZXUNRLErJnDDk4Ki
