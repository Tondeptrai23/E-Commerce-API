import { body } from "express-validator";
import { validatePositiveNumber } from "../utils.validator.js";

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
        .isNumeric()
        .withMessage("Price should be a number")
        .custom(validatePositiveNumber("Price")),

    // Validate variant stock
    body("variants.*.stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({
            min: 0,
        })
        .withMessage("Stock should be an integer greater than or equal to 0"),

    // Validate variant sku
    body("variants.*.sku")
        .notEmpty()
        .withMessage("SKU is required")
        .isString()
        .withMessage("SKU should be a string"),

    // Validate variant image order
    body("variants.*.imageOrder")
        .optional()
        .isInt({
            min: 1,
        })
        .withMessage(
            "Image order should be an integer greater than or equal to 1"
        ),

    // Validate variant discount price
    body("variants.*.discountPrice")
        .optional()
        .isNumeric()
        .withMessage("Discount price should be a number")
        .custom(validatePositiveNumber("Discount price")),

    // Validate variant discount price compare to price
    body("variants.*").custom(validateDiscountPrice),
];

const validatePatchVariant = [
    body("name").optional().isString().withMessage("Name should be a string"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("Price should be a number"),

    body("stock")
        .optional()
        .isInt({
            min: 0,
        })
        .withMessage("Stock should be an integer greater than or equal to 0"),

    body("sku").optional().isString().withMessage("SKU should be a string"),

    body("imageOrder")
        .optional()
        .isInt({
            min: 1,
        })
        .withMessage(
            "Image order should be an integer greater than or equal to 1"
        ),

    body("discountPrice")
        .optional()
        .isNumeric()
        .withMessage("Discount price should be a number")
        .custom(validatePositiveNumber("Discount price")),

    body("").custom(validateDiscountPrice),
];

const validatePutVariant = [
    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({
            min: 0,
        })
        .withMessage("Stock should be an integer greater than or equal to 0"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price should be a number")
        .custom(validatePositiveNumber("Price")),

    body("sku")
        .notEmpty()
        .withMessage("SKU is required")
        .isString()
        .withMessage("SKU should be a string"),

    body("imageOrder")
        .optional()
        .isInt({
            min: 1,
        })
        .withMessage(
            "Image order should be an integer greater than or equal to 1"
        ),

    body("discountPrice")
        .optional()
        .isNumeric()
        .withMessage("Discount price should be a number")
        .custom(validatePositiveNumber("Discount price")),

    body().custom(validateDiscountPrice),
];

export { validateCreateVariants, validatePutVariant, validatePatchVariant };
