import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new apiError(401, "Unauthorized");
    const verified = await jwt.verify(token, process.env.ACCESSTOKEN_KEY);
    if (!verified) throw new apiError(401, "Unauthorized");
    const user = await User.findById(verified._id).select(
      "-password -refreshToken"
    );
    if (!user) throw new apiError(400, "Invalid token");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    throw new apiError(500, err?.message || "Internal Server Error");
  }
});
export { authMiddleware };
