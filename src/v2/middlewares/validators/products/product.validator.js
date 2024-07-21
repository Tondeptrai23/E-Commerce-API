import { body } from "express-validator";
import { validateCreateVariants } from "./variant.validator.js";
import { validateCreateImages } from "./image.validator.js";
import { validateAddCategoriesForProduct } from "./category.validator.js";

const validateCreateProduct = [
    body("productID")
        .optional()
        .isString()
        .withMessage("Id should be a string"),

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    ...validateCreateVariants,

    body("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array"),
    ...validateCreateImages.slice(1),

    body("categories")
        .optional()
        .isArray()
        .withMessage("Categories should be an array"),
    ...validateAddCategoriesForProduct.slice(1),
];

const validatePatchProduct = [
    body("productID").not().exists().withMessage("Id should not be provided"),

    body("name").optional().isString().withMessage("Name should be a string"),

    body("description").optional().isString("Description should be a string"),

    body("defaultVariantID")
        .optional()
        .isString()
        .withMessage("Id should be a string"),
];

export { validateCreateProduct, validatePatchProduct };
