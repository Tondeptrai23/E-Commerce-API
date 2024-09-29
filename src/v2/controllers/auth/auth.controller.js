import { StatusCodes } from "http-status-codes";

import userService from "../../services/users/user.service.js";
import tokenService from "../../services/auth/token.service.js";
import {
    ConflictError,
    UnauthorizedError,
    ResourceNotFoundError,
    BadRequestError,
} from "../../utils/error.js";
import UserSerializer from "../../services/serializers/user.serializer.service.js";
import { googleConfig } from "../../config/config.js";
import { randomBytes } from "crypto";
import MailService from "../../services/users/mail.service.js";

class AuthController {
    async signin(req, res) {
        try {
            const isCorrectPassword = await userService.verifyUser(
                req.body.password,
                req.user.password
            );

            if (!isCorrectPassword) {
                throw new UnauthorizedError("Wrong email/password");
            }

            const accessToken = await tokenService.signToken({
                id: req.user.userID,
            });

            const refreshToken = await tokenService.createRefreshToken(
                req.user
            );

            await res.status(StatusCodes.OK).json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: UserSerializer.parse(req.user),
            });
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    errors: [
                        {
                            error: "Unauthorized",
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
                            message: "Error in signing in",
                        },
                    ],
                });
            }
        }
    }

    async googleCallback(req, res) {
        try {
            const user = {
                email: req.user._json.email,
                name: req.user._json.name,
            };

            const { user: existingUser, isExisted } =
                await userService.isUserExisted(user.email);

            let currentUser = existingUser;
            if (!isExisted) {
                currentUser = await userService.createNewAccount({
                    email: user.email,
                    password: randomBytes(4).toString("hex"),
                    name: user.name,
                });
            }

            const accessToken = await tokenService.signToken({
                id: currentUser.userID,
            });

            const refreshToken = await tokenService.createRefreshToken(
                currentUser
            );

            res.redirect(
                `${googleConfig.REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
            );
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in signing in with Google",
                    },
                ],
            });
        }
    }

    async signup(req, res) {
        try {
            // Get params
            const userInfo = {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
            };

            // Call services
            const user = await userService.createNewAccount(userInfo);

            // Send verification email
            const code = await tokenService.createVerificationCode(user.userID);
            await MailService.sendVerificationEmail(userInfo.email, code);

            // Send response
            res.status(StatusCodes.CREATED).json({
                success: true,
                message:
                    "Account created! Please check your email to verify your account",
            });
        } catch (err) {
            if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
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
                            message: "Error in signing up",
                        },
                    ],
                });
            }
        }
    }

    async refreshToken(req, res) {
        try {
            const accessToken = await tokenService.signToken({
                id: req.user.userID,
            });

            res.status(StatusCodes.CREATED).json({
                success: true,
                accessToken: accessToken,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in refreshing token",
                    },
                ],
            });
        }
    }

    async resetRefreshToken(req, res) {
        try {
            const refreshToken = await tokenService.createRefreshToken(
                req.user
            );

            const accessToken = await tokenService.signToken({
                id: req.user.userID,
            });

            res.status(StatusCodes.OK).json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in resetting token",
                    },
                ],
            });
        }
    }

    async resendVerificationEmail(req, res) {
        try {
            // Get params
            const { email } = req.body;

            // Check if user exists
            const { user, isExisted } = await userService.isUserExisted(email);
            if (!isExisted) {
                throw new ResourceNotFoundError("Email does not exist");
            }

            // Call services
            const code = await tokenService.createVerificationCode(user.userID);
            await MailService.sendVerificationEmail(email, code);

            // Send response
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Verification email sent",
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
                            message: "Error in resending verification email",
                        },
                    ],
                });
            }
        }
    }

    async verifyAccount(req, res) {
        try {
            // Get params
            const { code, email } = req.body;

            // Check if user exists
            const { user, isExisted } = await userService.isUserExisted(email);
            if (!isExisted) {
                throw new ResourceNotFoundError("Email does not exist");
            }

            // Call services
            await tokenService.verifyAccountVerificationCode(user.userID, code);

            // Send response
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Account verified successfully",
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
            } else if (err instanceof BadRequestError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: [
                        {
                            error: "BadRequest",
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
                            message: "Error in verifying account",
                        },
                    ],
                });
            }
        }
    }
}

export default new AuthController();
