import { body } from "express-validator";

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
        .isInt({
            min: 1,
        })
        .withMessage(
            "Quantity should be an integer greater than or equal to 1"
        ),
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
