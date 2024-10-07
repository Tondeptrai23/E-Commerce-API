import { StatusCodes } from "http-status-codes";
import { jwt } from "../config/auth.config.js";
import { BadRequestError } from "../utils/error.js";

export default function errorHandler(err, req, res, next) {
    if (err.isCustomError) {
        // Bad request error will have additional errors field
        if (err instanceof BadRequestError) {
            if (err.location === undefined) {
                return res.status(err.code).json({
                    success: false,
                    error: err.name,
                    message: err.message,
                });
            }

            return res.status(err.code).json({
                success: false,
                error: err.name,
                message: "Invalid Request",
                errors: [
                    {
                        location: err.location,
                        field: err.field,
                        value: err.value,
                        message: err.message,
                    },
                ],
            });
        }

        return res.status(err.code).json({
            success: false,
            error: err.name,
            message: err.message,
        });
    } else if (err instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: "TokenExpired",
            message: "Token expired",
        });
    } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: "TokenInvalid",
            message: "Token invalid",
        });
    }

    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "ServerError",
        message: "Server error! Please try again later",
    });
}
