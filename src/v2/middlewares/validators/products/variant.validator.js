import { body } from "express-validator";
import {
    validateInteger,
    validateMinValue,
    validateNumber,
} from "../utils.validator.js";

const validateDiscountPrice = (value) => {
    if (value.price && value.discountPrice > value.price) {
        throw new Error("Discount price should be less than or equal to price");
    }
    return true;
};

const validateCreateVariants = [
    body("variants")
        .notEmpty()
        .withMessage("Variants is required")
        .isArray()
        .withMessage("Variants should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Variants should have at least one item");
            }
            return true;
        }),

    // Validate variant price
    body("variants.*.price")
        .notEmpty()
        .withMessage("Price is required")
        .custom(validateNumber("Price"))
        .custom(validateMinValue("Price", 0)),

    // Validate variant stock
    body("variants.*.stock")
        .notEmpty()
        .withMessage("Stock is required")
        .custom(validateInteger("Stock"))
        .custom(validateMinValue("Stock", 0)),

    // Validate variant sku
    body("variants.*.sku")
        .notEmpty()
        .withMessage("SKU is required")
        .isString()
        .withMessage("SKU should be a string"),

    // Validate variant image order
    body("variants.*.imageID")
        .optional()
        .isString()
        .withMessage("ImageID should be a string"),

    // Validate variant discount price
    body("variants.*.discountPrice")
        .optional()
        .custom(validateNumber("Discount price"))
        .custom(validateMinValue("Discount price", 0)),

    // Validate variant discount price compare to price
    body("variants.*").custom(validateDiscountPrice),
];

const validatePatchVariant = [
    body("name").optional().isString().withMessage("Name should be a string"),

    body("price").optional().custom(validateNumber("Price")),

    body("stock")
        .optional()
        .custom(validateInteger("Stock"))
        .custom(validateMinValue("Stock", 0)),

    body("sku").optional().isString().withMessage("SKU should be a string"),

    body("imageID")
        .optional()
        .isString()
        .withMessage("ImageID should be a string"),

    body("discountPrice")
        .optional()
        .custom(validateNumber("Discount price"))
        .custom(validateMinValue("Discount price", 0)),

    body("").custom(validateDiscountPrice),
];

const validatePutVariant = [
    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .custom(validateInteger("Stock"))
        .custom(validateMinValue("Stock", 0)),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .custom(validateNumber("Price"))
        .custom(validateMinValue("Price", 0)),

    body("sku")
        .notEmpty()
        .withMessage("SKU is required")
        .isString()
        .withMessage("SKU should be a string"),

    body("imageID")
        .optional()
        .isString()
        .withMessage("ImageID should be a string"),

    body("discountPrice")
        .optional()
        .custom(validateNumber("Discount price"))
        .custom(validateMinValue("Discount price", 0)),

    body().custom(validateDiscountPrice),
];

export { validateCreateVariants, validatePutVariant, validatePatchVariant };
