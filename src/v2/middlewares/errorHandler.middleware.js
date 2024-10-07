import { StatusCodes } from "http-status-codes";
import { jwt } from "../config/auth.config.js";

export default function errorHandler(err, req, res, next) {
    if (err.isCustomError) {
        return res.status(err.code).json({
            success: false,
            errors: [
                {
                    error: err.name,
                    message: err.message,
                },
            ],
        });
    } else if (err instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            errors: [
                {
                    error: "TokenExpired",
                    message: "Token expired",
                },
            ],
        });
    } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            errors: [
                {
                    error: "TokenInvalid",
                    message: "Token invalid",
                },
            ],
        });
    }

    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        errors: [
            {
                error: "ServerError",
                message: "Server error! Please try again later",
            },
        ],
    });
}
