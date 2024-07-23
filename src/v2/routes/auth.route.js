import { Router } from "express";

import authController from "../controllers/auth/auth.controller.js";
import {
    checkEmailExistsForSignIn,
    checkEmailNotExistsForSignUp,
} from "../middlewares/auth/verifySigning.middlewares.js";
import { verifyRefreshToken } from "../middlewares/auth/authJwt.middlewares.js";
import validator from "../middlewares/validators/index.validator.js";

const authRoute = Router();

authRoute.post(
    "/signup",
    checkEmailNotExistsForSignUp,
    validator.validateRegisterUser,
    validator.handleValidationErrors,
    authController.signup
);

authRoute.post(
    "/signin",
    checkEmailExistsForSignIn,
    validator.validateSignInUser,
    validator.handleValidationErrors,
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
