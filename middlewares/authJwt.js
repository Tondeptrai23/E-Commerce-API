import { StatusCodes } from "http-status-codes";
import { jwt } from "../config/authConfig.js";
import { User } from "../models/userModel.js";
import { UnauthorizedError, ForbiddenError } from "../utils/error.js";

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new UnauthorizedError("Token not found.");
        }
        const decoded = await jwt.verify(token, jwt.secretKey, {
            algorithms: jwt.algorithm,
        });

        req.user = await User.findByPk(decoded.id);

        next();
    } catch (err) {
        console.log(err);
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Token invalid.",
            });
        } else if (err instanceof UnauthorizedError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying token.",
            });
        }
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "ROLE_ADMIN") {
            throw new ForbiddenError(
                "Not an admin. Cannot retrieve administrative data."
            );
        }

        req.admin = req.user;
        if (req.params.userId !== undefined) {
            req.user = await User.findByPk(req.params.userId);
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
                error: "Error in verifying role.",
            });
        }
    }
};

export { verifyToken, isAdmin };
