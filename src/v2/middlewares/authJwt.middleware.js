import User from "../models/user/user.model.js";
import {
    UnauthorizedError,
    ForbiddenError,
    ResourceNotFoundError,
} from "../utils/error.js";
import tokenService from "../services/auth/token.service.js";
import userService from "../services/users/user.service.js";

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
        next(err);
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
        next(err);
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
        next(err);
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

        if (user.isSoftDeleted()) {
            throw new UnauthorizedError("User is deleted");
        }

        if (user.isVerified === false) {
            throw new UnauthorizedError("User not verified");
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export { verifyToken, verifyRefreshToken, isAdmin, checkEmailExistsForSignIn };
