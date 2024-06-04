import { Router } from "express";

import { AuthController } from "../controllers/authController.js";
import {
    checkEmailExistsForSignIn,
    checkEmailNotExistsForSignUp,
} from "../middlewares/verifySigning.js";
import {
    handleValidationErrors,
    validateUser,
} from "../middlewares/validator.js";

const route = Router();

route.post(
    "/signup",
    validateUser,
    handleValidationErrors,
    checkEmailNotExistsForSignUp,
    AuthController.signUp
);

route.post(
    "/signin",
    validateUser,
    handleValidationErrors,
    checkEmailExistsForSignIn,
    AuthController.signIn
);

export { route as authRoute };
