import { Router } from "express";
import passwordResetController from "../../controllers/auth/passwordReset.controller.js";
import validator from "../../validators/index.validator.js";

const resetPasswordRoute = Router();

resetPasswordRoute.post(
    "/",
    validator.validateSendResetPassword,
    validator.handleValidationErrors,
    passwordResetController.sendResetPassword
);

resetPasswordRoute.post(
    "/reset",
    validator.validateResetPassword,
    validator.handleValidationErrors,
    passwordResetController.resetPassword
);

resetPasswordRoute.post(
    "/verify",
    validator.validateVerifyResetPasswordCode,
    validator.handleValidationErrors,
    passwordResetController.verifyResetPasswordCode
);

export default resetPasswordRoute;
