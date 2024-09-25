import { Router } from "express";
import userController from "../../../controllers/users/user.controller.js";
import { verifyToken } from "../../../middlewares/auth/authJwt.middleware.js";

const userInfoRoute = Router();

userInfoRoute.get("/", verifyToken, userController.getUser);

export default userInfoRoute;
