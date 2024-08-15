import { body, query } from "express-validator";
import { validateCreateVariants } from "./variant.validator.js";
import { validateCreateImages } from "./image.validator.js";
import { validateAddCategoriesForProduct } from "./category.validator.js";
import {
    validateQueryNumber,
    stringRegex,
    sanitizeSortingQuery,
    validateSortingQuery,
    validateUnexpectedFields,
    validateQueryInteger,
} from "../utils.validator.js";

const validateCreateProduct = [
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

    body().custom(
        validateUnexpectedFields([
            "name",
            "description",
            "variants",
            "images",
            "categories",
        ])
    ),
];

const validatePatchProduct = [
    body("productID").not().exists().withMessage("ID should not be provided"),

    body("name").optional().isString().withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),
];

const validateQueryGetProductUser = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery(["price", "name", "discountPrice", "stock"])
        ),

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

    query("variant.discountPrice")
        .optional()
        .custom(validateQueryNumber("Variant discount price")),

    query("variant.stock")
        .optional()
        .custom(validateQueryNumber("Variant stock")),

    query("variant.sku")
        .optional()
        .matches(stringRegex)
        .withMessage(`Variant SKU should match regex ${stringRegex}`),

    query("category")
        .optional()
        .custom((value) => {
            if (typeof value !== "string" && !Array.isArray(value)) {
                throw new Error("Category should be a string or an array");
            }

            return true;
        }),

    query("attributes")
        .optional()
        .isObject()
        .withMessage("Attributes should be an object"),
];

const validateQueryGetProduct = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "productID",
                "name",
                "createdAt",
                "updatedAt",
                "deletedAt",
                "price",
                "discountPrice",
                "stock",
            ])
        ),

    query("productID")
        .optional()
        .matches(stringRegex)
        .withMessage(`ID should match regex ${stringRegex}`),

    query("name")
        .optional()
        .matches(stringRegex)
        .withMessage(`Name should match regex ${stringRegex}`),

    query("updatedAt")
        .optional()
        .isISO8601()
        .withMessage("UpdatedAt should be a valid date"),

    query("createdAt")
        .optional()
        .isISO8601()
        .withMessage("CreatedAt should be a valid date"),

    query("deletedAt")
        .optional()
        .isISO8601()
        .withMessage("DeletedAt should be a valid date"),

    query("variant")
        .optional()
        .isObject()
        .withMessage("Variant should be an object"),

    query("variant.price")
        .optional()
        .custom(validateQueryNumber("Variant price")),

    query("variant.discountPrice")
        .optional()
        .custom(validateQueryNumber("Variant discount price")),

    query("variant.stock")
        .optional()
        .custom(validateQueryNumber("Variant stock")),

    query("variant.sku")
        .optional()
        .matches(stringRegex)
        .withMessage(`Variant SKU should match regex ${stringRegex}`),

    query("category")
        .optional()
        .custom((value) => {
            if (typeof value !== "string" && !Array.isArray(value)) {
                throw new Error("Category should be a string or an array");
            }

            return true;
        }),

    query("attributes")
        .optional()
        .isObject()
        .withMessage("Attributes should be an object"),
];

export {
    validateCreateProduct,
    validatePatchProduct,
    validateQueryGetProduct,
    validateQueryGetProductUser,
};
