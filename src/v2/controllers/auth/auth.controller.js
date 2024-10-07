import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";

import userService from "../../services/users/user.service.js";
import tokenService from "../../services/auth/token.service.js";
import { UnauthorizedError, ResourceNotFoundError } from "../../utils/error.js";
import UserSerializer from "../../services/serializers/user.serializer.service.js";
import { googleConfig } from "../../config/config.js";
import MailService from "../../services/users/mail.service.js";

class AuthController {
    async signin(req, res, next) {
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
            next(err);
        }
    }

    async googleCallback(req, res, next) {
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
            next(err);
        }
    }

    async signup(req, res, next) {
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
            next(err);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const accessToken = await tokenService.signToken({
                id: req.user.userID,
            });

            res.status(StatusCodes.CREATED).json({
                success: true,
                accessToken: accessToken,
            });
        } catch (err) {
            next(err);
        }
    }

    async resetRefreshToken(req, res, next) {
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
            next(err);
        }
    }

    async resendVerificationEmail(req, res, next) {
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
            next(err);
        }
    }

    async verifyAccount(req, res, next) {
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
            next(err);
        }
    }
}

export default new AuthController();
