import { Router } from "express";

import { AuthController } from "../controllers/authController.js";
import {
    checkEmailExistsForSignIn,
    checkEmailNotExistsForSignUp,
} from "../middlewares/verifySigning.js";
import {
    handleValidationErrors,
    validateRegisterUser,
    validateSignInUser,
} from "../middlewares/validator.js";

const route = Router();

route.post(
    "/signup",
    validateRegisterUser,
    handleValidationErrors,
    checkEmailNotExistsForSignUp,
    AuthController.signUp
);

route.post(
    "/signin",
    validateSignInUser,
    handleValidationErrors,
    checkEmailExistsForSignIn,
    AuthController.signIn
);

export { route as authRoute };
