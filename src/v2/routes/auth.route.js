import { Router } from "express";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/signup", authController.signup);

authRoute.post("/signin", authController.signin);

authRoute.post("/refreshToken", authController.refreshToken);

authRoute.post("/refreshToken/reset", authController.resetRefreshToken);

export default authRoute;
