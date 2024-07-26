import { body, query } from "express-validator";
import { validateCreateVariants } from "./variant.validator.js";
import { validateCreateImages } from "./image.validator.js";
import { validateAddCategoriesForProduct } from "./category.validator.js";
import { validateQueryNumber, stringRegex } from "../utils.validator.js";

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
];

const validateQueryGetProduct = [
    query("name")
        .optional()
        .matches(stringRegex)
        .withMessage(`Name should match regex ${stringRegex}`),

    query("variant")
        .optional()
        .isObject()
        .withMessage("Variant should be an object"),

    query("variant.price")
        .optional()
        .custom(validateQueryNumber("Variant price")),

    query("variant.stock")
        .optional()
        .custom(validateQueryNumber("Variant stock")),

    query("category")
        .optional()
        .custom((value) => {
            if (typeof value !== "string" && !Array.isArray(value)) {
                throw new Error("Category should be a string or an array");
            }

            return true;
        }),

    query("attribute")
        .optional()
        .isObject()
        .withMessage("Attribute should be an object"),
];

export { validateCreateProduct, validatePatchProduct, validateQueryGetProduct };
