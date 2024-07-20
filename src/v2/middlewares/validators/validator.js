import { body } from "express-validator";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

const validateRegisterUser = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email should be a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({
            min: 6,
        })
        .withMessage("Password should be longer than 6 characters"),

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isAlphanumeric()
        .withMessage("Name should be an alphanumeric string"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["user", "admin"])
        .withMessage("Role should be valid"),

    body("phoneNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Phone number should be a valid phone number"),

    body("avatar")
        .optional()
        .isURL()
        .withMessage("Avatar should be a valid URL"),
];

const validateSignInUser = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email should be a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({
            min: 6,
        })
        .withMessage("Password should be longer than 6 characters"),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};

export { validateRegisterUser, validateSignInUser, handleValidationErrors };
