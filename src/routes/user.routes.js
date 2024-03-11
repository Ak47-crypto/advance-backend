import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const userRouter = Router();
userRouter.route("/registeruser").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);
userRouter.route("/login").post(login);

// logout
userRouter.route("/logout").post(authMiddleware, logout);
export { userRouter };
