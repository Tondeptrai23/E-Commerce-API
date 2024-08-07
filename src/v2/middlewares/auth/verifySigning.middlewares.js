import { StatusCodes } from "http-status-codes";
import userService from "../../services/auth/user.service.js";
import { ResourceNotFoundError, ConflictError } from "../../utils/error.js";

const checkEmailExistsForSignIn = async (req, res, next) => {
    try {
        const { user, isExisted } = await userService.isUserExisted(
            req.body.email
        );

        if (!isExisted) {
            throw new ResourceNotFoundError("Email not found");
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        if (err instanceof ResourceNotFoundError) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying email",
            });
        }
    }
};

const checkEmailNotExistsForSignUp = async (req, res, next) => {
    try {
        const { user, isExisted } = await userService.isUserExisted(
            req.body.email
        );

        if (isExisted) {
            throw new ConflictError(
                "Email already exists! Cannot create account"
            );
        }
        next();
    } catch (err) {
        console.log(err);
        if (err instanceof ConflictError) {
            res.status(StatusCodes.CONFLICT).json({
                success: false,
                error: err.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in verifying email",
            });
        }
    }
};

export { checkEmailExistsForSignIn, checkEmailNotExistsForSignUp };
