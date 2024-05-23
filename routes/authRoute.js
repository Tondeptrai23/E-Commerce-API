import { Router } from "express";

import { AuthController } from "../controllers/authController.js";

const route = Router();

route.get("/signup", AuthController.signUp);

route.get("/signin", AuthController.signIn);

export { route as authRoute };
