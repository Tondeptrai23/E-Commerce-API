import { body } from "express-validator";

const validateSendVerifyAccount = [
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

const validateVerifyVerifyAccountCode = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),
];

export { validateSendVerifyAccount, validateVerifyVerifyAccountCode };
