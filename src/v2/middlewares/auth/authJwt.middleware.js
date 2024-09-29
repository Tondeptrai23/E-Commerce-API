import { StatusCodes } from "http-status-codes";
import { jwt } from "../../config/auth.config.js";
import User from "../../models/user/user.model.js";
import {
    UnauthorizedError,
    ForbiddenError,
    ResourceNotFoundError,
} from "../../utils/error.js";
import tokenService from "../../services/auth/token.service.js";
import userService from "../../services/users/user.service.js";

const verifyToken = async (req, res, next) => {
    try {
        if (!req.header("Authorization")) {
            throw new UnauthorizedError("Token not found");
        }

        let token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new UnauthorizedError("Token not found");
        }

        const decoded = await tokenService.decodeToken(token);

        req.user = await User.findByPk(decoded.id);
        if (req.user === null) {
            throw new UnauthorizedError("User not found");
        }

        if (req.user.isVerified === false) {
            throw new UnauthorizedError("User not verified");
        }

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                errors: [
                    {
                        error: "TokenExpired",
                        message: "Token expired",
                    },
                ],
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                errors: [
                    {
                        error: "TokenInvalid",
                        message: "Token invalid",
                    },
                ],
            });
        } else if (err instanceof UnauthorizedError) {
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in verifying token",
                    },
                ],
            });
        }
    }
};

const verifyRefreshToken = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) {
            throw new UnauthorizedError("Token not found");
        }

        req.user = await tokenService.decodeRefreshToken(token);

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                errors: [
                    {
                        error: "TokenExpired",
                        message: "Token expired",
                    },
                ],
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                errors: [
                    {
                        error: "TokenInvalid",
                        message: "Token invalid",
                    },
                ],
            });
        } else if (
            err instanceof UnauthorizedError ||
            err instanceof ResourceNotFoundError
        ) {
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in verifying token",
                    },
                ],
            });
        }
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            throw new ForbiddenError(
                "Not an admin. Cannot retrieve administrative data"
            );
        }

        req.admin = req.user;
        if (req.params.userID !== undefined) {
            req.user = await User.findByPk(req.params.userID);
        }

        next();
    } catch (err) {
        if (err instanceof ForbiddenError) {
            res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                errors: [
                    {
                        error: "Forbidden",
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
                        message: "Error in verifying token",
                    },
                ],
            });
        }
    }
};

const checkEmailExistsForSignIn = async (req, res, next) => {
    try {
        const { user, isExisted } = await userService.isUserExisted(
            req.body.email
        );

        if (!isExisted) {
            throw new ResourceNotFoundError("Email not found");
        }

        if (user.isVerified === false) {
            throw new UnauthorizedError("User not verified");
        }

        req.user = user;
        next();
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
        } else if (err instanceof UnauthorizedError) {
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Error in verifying email",
                    },
                ],
            });
        }
    }
};

export { verifyToken, verifyRefreshToken, isAdmin, checkEmailExistsForSignIn };
