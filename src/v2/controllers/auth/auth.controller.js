import { StatusCodes } from "http-status-codes";

import userService from "../../services/users/user.service.js";
import tokenService from "../../services/auth/token.service.js";
import { ConflictError, UnauthorizedError } from "../../utils/error.js";
import UserSerializer from "../../services/serializers/user.serializer.service.js";
import { googleConfig } from "../../config/config.js";
import { randomBytes } from "crypto";

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

            console.log("-------------");

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
            const userInfo = {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
            };

            await userService.createNewAccount(userInfo);
            res.status(StatusCodes.CREATED).json({
                success: true,
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

    async forgotPassword(req, res) {
        res.json({ message: "Not implemented" });
    }
}

export default new AuthController();
