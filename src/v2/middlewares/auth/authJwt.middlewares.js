import { StatusCodes } from "http-status-codes";
import { jwt } from "../../config/auth.config.js";
import User from "../../models/user/user.model.js";
import {
    UnauthorizedError,
    ForbiddenError,
    ResourceNotFoundError,
} from "../../utils/error.js";
import tokenService from "../../services/auth/token.service.js";

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new UnauthorizedError("Token not found");
        }

        const decoded = await tokenService.decodeToken(token);

        req.user = await User.findByPk(decoded.id);
        if (req.user === null) {
            throw new UnauthorizedError("User not found");
        }
        next();
    } catch (err) {
        console.log(err);

        if (err instanceof jwt.TokenExpiredError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Token expired",
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Token invalid",
            });
        } else if (err instanceof UnauthorizedError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying token",
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
        console.log(err);

        if (err instanceof jwt.TokenExpiredError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Token expired",
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Token invalid",
            });
        } else if (
            err instanceof UnauthorizedError ||
            err instanceof ResourceNotFoundError
        ) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying token",
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
        console.log(err);
        if (err instanceof ForbiddenError) {
            res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying role",
            });
        }
    }
};

export { verifyToken, verifyRefreshToken, isAdmin };
