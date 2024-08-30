import { body } from "express-validator";
import {
    validateInteger,
    validateMinValue,
    validateQueryInteger,
} from "../utils.validator.js";

const validateAddToCart = [
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .custom(validateInteger("Quantity"))
        .custom(validateMinValue("Quantity", 1)),
];

const validateUpdateCart = [
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .custom(validateInteger("Quantity"))
        .custom(validateMinValue("Quantity", 1)),
];

const validateQueryCart = [
    body("page").custom(validateQueryInteger("Page")),

    body("size").custom(validateQueryInteger("Size")),
];

const validateFetchCart = [
    body("variantIDs")
        .notEmpty()
        .withMessage("VariantIDs is required")
        .isArray()
        .withMessage("VariantIDs should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("VariantIDs should not be empty");
            }

            return true;
        }),

    body("variantIDs.*").isString().withMessage("VariantID should be a string"),
];

export {
    validateAddToCart,
    validateUpdateCart,
    validateFetchCart,
    validateQueryCart,
};
