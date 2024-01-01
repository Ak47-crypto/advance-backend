import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js';
const userRouter= Router();
userRouter.route("/registeruser").get(registerUser)
export  {userRouter}