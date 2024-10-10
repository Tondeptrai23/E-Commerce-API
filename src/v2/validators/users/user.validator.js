import { body, query } from "express-validator";
import {
    sanitizeSortingQuery,
    validateSortingQuery,
    validateQueryInteger,
    validateQueryString,
    validateQueryDate,
} from "../utils.validator.js";

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

const validateCreateUser = [
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
        .isIn(["admin", "user"])
        .withMessage("Role should be either admin or user"),
];

const validateUpdateUser = [
    body("name")
        .optional()
        .isAlphanumeric()
        .withMessage("Name should be an alphanumeric string"),

    body("role")
        .optional()
        .isIn(["admin", "user"])
        .withMessage("Role should be either admin or user"),
];

const validateQueryUser = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "userID",
                "name",
                "role",
                "email",
                "isVerified",
                "createdAt",
                "updatedAt",
                "deletedAt",
            ])
        ),

    query("userID").optional().custom(validateQueryString("UserID")),

    query("name").optional().custom(validateQueryString("Name")),

    query("role")
        .optional()
        .custom((value) => {
            const roles = ["admin", "user"];

            if (typeof value == "string" && !roles.includes(value)) {
                throw new Error("Role should be either admin or user");
            }

            if (Array.isArray(value)) {
                value.forEach((role) => {
                    if (!roles.includes(role)) {
                        throw new Error("Role should be either admin or user");
                    }
                });
            }

            return true;
        }),

    query("email").optional().custom(validateQueryString("Email")),

    query("isVerified")
        .optional()
        .customSanitizer((value) => {
            if (value === "true") {
                return true;
            }

            if (value === "false") {
                return false;
            }

            return null;
        }),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("deletedAt").optional().custom(validateQueryDate("DeletedAt")),
];

export {
    validateQueryUser,
    validateRegisterUser,
    validateSignInUser,
    validateCreateUser,
    validateUpdateUser,
};
