import { Router } from "express";

import authController from "../controllers/auth/auth.controller.js";
import {
    verifyRefreshToken,
    checkEmailExistsForSignIn,
} from "../middlewares/auth/authJwt.middlewares.js";
import validator from "../middlewares/validators/index.validator.js";
import passport, { REDIRECT_URL_FAILED } from "../config/passport.config.js";

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

authRoute.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

authRoute.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: REDIRECT_URL_FAILED,
        session: false,
    }),
    authController.googleCallback
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
