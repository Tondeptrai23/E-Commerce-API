import { body, query } from "express-validator";

import {
    sanitizeSortingQuery,
    validateQueryDate,
    validateQueryInteger,
    validateQueryString,
    validateSortingQuery,
} from "../utils.validator.js";

const validateAddCategoriesForProduct = [
    body("categories")
        .notEmpty()
        .withMessage("Categories are required")
        .isArray()
        .withMessage("Categories should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Categories should have at least one item");
            }
            return true;
        }),

    body("categories.*").isString().withMessage("Category should be a string"),
];

const validatePutCategoriesForProduct = [
    body("categories")
        .notEmpty()
        .withMessage("Categories are required")
        .isArray()
        .withMessage("Categories should be an array"),

    body("categories.*").isString().withMessage("Category should be a string"),
];

const validateAddCategory = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    body("parent")
        .optional()
        .isString()
        .withMessage("Parent should be a string"),
];

const validatePutCategory = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    body("parent")
        .optional()
        .isString()
        .withMessage("Parent should be a string"),
];

const validateQueryGetCategoryUser = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),
];

const validateQueryGetCategoryAdmin = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "categoryID",
                "parentID",
                "name",
                "createdAt",
                "updatedAt",
            ])
        ),

    query("categoryID").optional().custom(validateQueryString("CategoryID")),

    query("name").optional().custom(validateQueryString("Name")),

    query("parentID").optional().custom(validateQueryString("ParentID")),

    query("parentName").optional().custom(validateQueryString("ParentName")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),
];

export {
    validateAddCategoriesForProduct,
    validatePutCategoriesForProduct,
    validateAddCategory,
    validatePutCategory,
    validateQueryGetCategoryUser,
    validateQueryGetCategoryAdmin,
};
