import { Router } from "express";
import passwordResetController from "../../controllers/auth/passwordReset.controller.js";

const resetPasswordRoute = Router();

resetPasswordRoute.post("/", passwordResetController.sendResetPassword);

resetPasswordRoute.post("/reset", passwordResetController.resetPassword);

resetPasswordRoute.post(
    "/verify",
    passwordResetController.verifyResetPasswordCode
);

export default resetPasswordRoute;
