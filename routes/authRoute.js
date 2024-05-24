import { Router } from "express";

import { AuthController } from "../controllers/authController.js";
import {
    checkEmailExistsForSignIn,
    checkEmailNotExistsForSignUp,
} from "../middlewares/verifySigning.js";

const route = Router();

route.post("/signup", checkEmailNotExistsForSignUp, AuthController.signUp);

route.post("/signin", checkEmailExistsForSignIn, AuthController.signIn);

export { route as authRoute };
