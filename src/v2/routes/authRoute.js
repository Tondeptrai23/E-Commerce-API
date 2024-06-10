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
import { verifyRefreshToken } from "../middlewares/authJwt.js";

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

route.post("/refreshToken", verifyRefreshToken, AuthController.refresh);

route.post(
    "/refreshToken/reset",
    verifyRefreshToken,
    AuthController.resetToken
);

export { route as authRoute };
