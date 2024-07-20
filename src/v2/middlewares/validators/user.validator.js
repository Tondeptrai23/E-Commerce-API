import { body } from "express-validator";

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
            min: 8,
        })
        .withMessage("Password should be longer than 6 characters"),
];

export { validateRegisterUser, validateSignInUser };
