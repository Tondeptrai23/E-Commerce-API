import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import {
    checkEmailExistsForSignIn,
    checkEmailNotExistsForSignUp,
} from "../middlewares/verifySigning.js";
import { verifyRefreshToken } from "../middlewares/authJwt.js";
import {
    handleValidationErrors,
    validateRegisterUser,
    validateSignInUser,
} from "../middlewares/validator.js";

const authRoute = Router();

authRoute.post(
    "/signup",
    checkEmailNotExistsForSignUp,
    validateRegisterUser,
    handleValidationErrors,
    authController.signup
);

authRoute.post(
    "/signin",
    checkEmailExistsForSignIn,
    validateSignInUser,
    handleValidationErrors,
    authController.signin
);

authRoute.post(
    "/refreshToken",
    verifyRefreshToken,
    authController.refreshToken
);

authRoute.post(
    "/refreshToken/reset",
    verifyRefreshToken,
    authController.resetRefreshToken
);

export default authRoute;
