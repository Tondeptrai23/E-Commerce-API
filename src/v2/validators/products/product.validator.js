import { body, header, query } from "express-validator";
import { validateCreateVariants } from "./variant.validator.js";
import { validateAddCategoriesForProduct } from "./category.validator.js";
import {
    validateQueryNumber,
    sanitizeSortingQuery,
    validateSortingQuery,
    validateUnexpectedFields,
    validateQueryInteger,
    validateQueryString,
    validateQueryDate,
} from "../utils.validator.js";

const validateCreateProduct = [
    body()
        .if(
            header("Content-Type").custom((value) => {
                return value.includes("multipart/form-data");
            })
        )
        .customSanitizer((value) => {
            return JSON.parse(value.product);
        }),

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    ...validateCreateVariants.slice(1),

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
            "categories",
        ])
    ),
];

const validatePatchProduct = [
    body("name").optional().isString().withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    body().custom(validateUnexpectedFields(["name", "description"])),
];

const validateQueryGetProductUser = [
    // Validate query parameters
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery(["price", "name", "discountPrice", "stock"])
        ),

    query("name").optional().custom(validateQueryString("Name")),

    query("variant")
        .optional()
        .isObject()
        .withMessage("Variant should be an object"),

    query("variant.price")
        .optional()
        .custom(validateQueryNumber("VariantPrice")),

    query("variant.discountPrice")
        .optional()
        .custom(validateQueryNumber("VariantDiscountPrice")),

    query("variant.stock")
        .optional()
        .custom(validateQueryNumber("VariantStock")),

    query("variant.sku").optional().custom(validateQueryString("VariantSKU")),

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
    // Validate query parameters
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

    query("productID").optional().custom(validateQueryString("ProductID")),

    query("name").optional().custom(validateQueryString("Name")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("deletedAt").optional().custom(validateQueryDate("DeletedAt")),

    query("variant")
        .optional()
        .isObject()
        .withMessage("Variant should be an object"),

    query("variant.price")
        .optional()
        .custom(validateQueryNumber("VariantPrice")),

    query("variant.discountPrice")
        .optional()
        .custom(validateQueryNumber("VariantDiscountPrice")),

    query("variant.stock")
        .optional()
        .custom(validateQueryNumber("VariantStock")),

    query("variant.sku").optional().custom(validateQueryString("VariantSKU")),

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
