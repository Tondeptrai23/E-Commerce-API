import { Router } from "express";

import authController from "../controllers/auth/auth.controller.js";
import {
    verifyRefreshToken,
    checkEmailExistsForSignIn,
} from "../middlewares/auth/authJwt.middlewares.js";
import validator from "../middlewares/validators/index.validator.js";

const authRoute = Router();

authRoute.post(
    "/signup",
    validator.validateRegisterUser,
    validator.handleValidationErrors,
    authController.signup
);

authRoute.post(
    "/signin",
    validator.validateSignInUser,
    validator.handleValidationErrors,
    checkEmailExistsForSignIn,
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
