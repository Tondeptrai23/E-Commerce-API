import { body } from "express-validator";
import { validateInteger, validateMinValue } from "../utils.validator.js";

const validateAddToCart = [
    body("variantID")
        .notEmpty()
        .withMessage("Variant ID is required")
        .isString()
        .withMessage("Variant ID should be a string"),
];

const validateUpdateCart = [
    body("variantID")
        .notEmpty()
        .withMessage("Variant ID is required")
        .isString()
        .withMessage("Variant ID should be a string"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .custom(validateInteger("Quantity"))
        .custom(validateMinValue("Quantity", 1)),
];

const validateFetchCart = [
    body("variantIDs")
        .notEmpty()
        .withMessage("Variant IDs is required")
        .isArray()
        .withMessage("Variant IDs should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Variant IDs should not be empty");
            }

            return true;
        })
        .custom((value) => {
            const isValid = value.every((item) => typeof item === "string");
            if (!isValid) {
                throw new Error("Variant IDs should be an array of strings");
            }

            return true;
        }),
];

export { validateAddToCart, validateUpdateCart, validateFetchCart };
