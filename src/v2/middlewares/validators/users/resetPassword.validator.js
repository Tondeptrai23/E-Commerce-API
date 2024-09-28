import { body } from "express-validator";

const validateSendResetPassword = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),
];

const validateResetPassword = [
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be a string")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),

    body("sessionToken")
        .notEmpty()
        .withMessage("SessionToken is required")
        .isString()
        .withMessage("SessionToken should be a string"),
];

const validateVerifyResetPasswordCode = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),

    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isString()
        .withMessage("Code should be a string"),
];

export {
    validateSendResetPassword,
    validateResetPassword,
    validateVerifyResetPasswordCode,
};
