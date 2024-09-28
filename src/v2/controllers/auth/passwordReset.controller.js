import MailService from "../../services/users/mail.service.js";
import { StatusCodes } from "http-status-codes";
import userService from "../../services/users/user.service.js";
import tokenService from "../../services/auth/token.service.js";
import { BadRequestError, ResourceNotFoundError } from "../../utils/error.js";

class PasswordResetController {
    async sendResetPassword(req, res) {
        try {
            // Get params
            const { email } = req.body;

            // Check if user exists
            const { user, isExisted } = await userService.isUserExisted(email);
            if (!isExisted) {
                throw new ResourceNotFoundError("Email does not exist");
            }

            // Call services
            const code = await tokenService.createResetPasswordCode(
                user.userID
            );
            await MailService.sendResetPasswordEmail(user, code);

            // Send response
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Reset password code has been sent to your email",
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Error in resetting password",
                        },
                    ],
                });
            }
        }
    }

    async verifyResetPasswordCode(req, res) {
        try {
            // Get params
            const { code, email } = req.body;

            // Check if user exists
            const { user, isExisted } = await userService.isUserExisted(email);
            if (!isExisted) {
                throw new ResourceNotFoundError("Email does not exist");
            }

            // Call services
            await tokenService.verifyResetPasswordCode(user.userID, code);
            const sessionToken =
                await tokenService.createResetPasswordSessionToken(user.userID);

            // Send response
            res.status(StatusCodes.OK).json({
                success: true,
                sessionToken: sessionToken,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Error in verifying reset password code",
                        },
                    ],
                });
            }
        }
    }

    async resetPassword(req, res) {
        try {
            // Get params
            const { sessionToken, email, password } = req.body;

            // Check if user exists
            const { user, isExisted } = await userService.isUserExisted(email);
            if (!isExisted) {
                throw new ResourceNotFoundError("Email does not exist");
            }

            // Call services
            await tokenService.verifyResetPasswordCode(
                user.userID,
                sessionToken
            );
            await userService.resetPassword(user, password);
            await MailService.sendPasswordIsChangedEmail(user);

            // Send response
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Password has been reset",
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Error in resetting password",
                        },
                    ],
                });
            }
        }
    }
}

export default new PasswordResetController();
