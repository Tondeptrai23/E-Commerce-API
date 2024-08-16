import { StatusCodes } from "http-status-codes";

import userService from "../../services/auth/user.service.js";
import tokenService from "../../services/auth/token.service.js";
import { BadRequestError } from "../../utils/error.js";
import UserSerializer from "../../services/serializers/user.serializer.service.js";

class AuthController {
    async signin(req, res) {
        try {
            const isCorrectPassword = await userService.verifyUser(
                req.body.password,
                req.user.password
            );

            if (!isCorrectPassword) {
                throw new BadRequestError("Wrong email/password");
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
            if (err instanceof BadRequestError) {
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

    async signup(req, res) {
        try {
            const userInfo = {
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
            };

            await userService.createNewAccount(userInfo);
            res.status(StatusCodes.CREATED).json({
                success: true,
            });
        } catch (err) {
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
}

export default new AuthController();
