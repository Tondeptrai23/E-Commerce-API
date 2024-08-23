import { body, query } from "express-validator";
import {
    validateInteger,
    validateMinValue,
    validateNumber,
    validateUnexpectedFields,
    sanitizeSortingQuery,
    validateSortingQuery,
    validateQueryNumber,
    validateQueryInteger,
    validateQueryString,
    validateQueryDate,
} from "../utils.validator.js";

const validateCreateCoupon = [
    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isString()
        .withMessage("Code should be a string"),

    body("discountType")
        .notEmpty()
        .withMessage("Discount type is required")
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    body("discountValue")
        .notEmpty()
        .withMessage("Discount value is required")
        .custom(validateNumber("Discount value"))
        .custom(validateMinValue("Discount value", 0)),

    body("target")
        .notEmpty()
        .withMessage("Target is required")
        .isIn(["all", "single"])
        .withMessage("Target should be valid"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    body("minimumOrderAmount")
        .optional()
        .custom(validateNumber("Minimum order amount"))
        .custom(validateMinValue("Minimum order amount", 0))
        .custom((value, { req }) => {
            if (req.body.discountType === "percentage" && value > 100) {
                throw new Error(
                    "Minimum order amount should be less than 100 for percentage discount"
                );
            }

            return true;
        }),

    body("maxUsage")
        .optional()
        .custom(validateInteger("Max usage"))
        .custom(validateMinValue("Max usage", 0)),

    body("startDate")
        .optional()
        .isString()
        .withMessage("Start date should be a string of date")
        .isISO8601()
        .withMessage("Start date should be a valid date (ISO8601)")
        .toDate(),

    body("endDate")
        .optional()
        .isString()
        .withMessage("Start date should be a string of date")
        .isISO8601()
        .withMessage("End date should be a valid date (ISO8601)")
        .toDate(),

    body().custom((value) => {
        if (value.startDate && value.endDate) {
            if (
                new Date(value.startDate).getTime() >
                new Date(value.endDate).getTime()
            ) {
                throw new Error("Start date should be before end date");
            }
        }

        return true;
    }),

    body("categories")
        .optional()
        .isArray()
        .withMessage("Categories should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Categories should have at least one item");
            }
            return true;
        }),

    body("categories.*")
        .optional()
        .isString()
        .withMessage("Category should be a string"),

    body("productIDs")
        .optional()
        .isArray()
        .withMessage("ProductIDs should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("ProductIDs should have at least one item");
            }
            return true;
        }),

    body("productIDs.*")
        .optional()
        .isString()
        .withMessage("ProductID should be a string"),

    body().custom(
        validateUnexpectedFields([
            "code",
            "discountType",
            "discountValue",
            "target",
            "description",
            "minimumOrderAmount",
            "maxUsage",
            "startDate",
            "endDate",
            "products",
            "categories",
        ])
    ),
];

const validatePatchCoupon = [
    body("description")
        .optional()
        .isString()
        .withMessage("Description should be a string"),

    body("minimumOrderAmount")
        .optional()
        .custom(validateNumber("Minimum order amount"))
        .custom(validateMinValue("Minimum order amount", 0)),

    body("maxUsage")
        .optional()
        .custom(validateInteger("Max usage"))
        .custom(validateMinValue("Max usage", 0)),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date should be a valid date (ISO8601)"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date should be a valid date (ISO8601)"),

    body().custom((value) => {
        if (value.startDate && value.endDate) {
            if (
                new Date(value.startDate).getTime() >
                new Date(value.endDate).getTime()
            ) {
                throw new Error("Start date should be before end date");
            }
        }

        return true;
    }),

    body().custom(
        validateUnexpectedFields([
            "description",
            "minimumOrderAmount",
            "maxUsage",
            "startDate",
            "endDate",
        ])
    ),
];

const validateAddCategoriesCoupon = [
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

const validateAddProductsCoupon = [
    body("productIDs")
        .notEmpty()
        .withMessage("ProductIDs are required")
        .isArray()
        .withMessage("ProductIDs should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("ProductIDs should have at least one item");
            }
            return true;
        }),

    body("productIDs.*").isString().withMessage("ProductID should be a string"),
];

const validateQueryGetCoupon = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "couponID",
                "code",
                "discountType",
                "discountValue",
                "target",
                "minimumOrderAmount",
                "maxUsage",
                "startDate",
                "endDate",
                "createdAt",
                "updatedAt",
            ])
        ),

    query("code").optional().custom(validateQueryString("Code")),

    query("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    query("discountValue")
        .optional()
        .custom(validateQueryNumber("Discount value")),

    query("target")
        .optional()
        .isIn(["all", "single"])
        .withMessage("Target should be valid"),

    query("description").optional().custom(validateQueryString("Description")),

    query("minimumOrderAmount")
        .optional()
        .custom(validateQueryNumber("Minimum order amount")),

    query("maxUsage").optional().custom(validateQueryNumber("Max usage")),

    query("startDate").optional().custom(validateQueryDate("Start date")),

    query("endDate").optional().custom(validateQueryDate("End date")),

    query("createdAt").optional().custom(validateQueryDate("Created at")),

    query("updatedAt").optional().custom(validateQueryDate("Updated at")),

    query("product")
        .optional()
        .isObject()
        .withMessage("Product should be an object"),

    query("product.name")
        .optional()
        .custom(validateQueryString("Product name")),

    query("product.productID")
        .optional()
        .custom(validateQueryString("Product ID")),

    query("product.createdAt")
        .optional()
        .custom(validateQueryDate("Product created at")),

    query("category")
        .optional()
        .custom((value) => {
            if (!Array.isArray(value) && typeof value !== "string") {
                throw new Error("Category should be an array or a string");
            }

            if (Array.isArray(value)) {
                if (value.some((category) => typeof category !== "string")) {
                    throw new Error("Category should be a string");
                }
            }

            return true;
        }),

    // Sanitize unexpected parameters (ignore them)
    query().customSanitizer((value) => {
        if (!value) return value;

        const allowedFields = [
            "page",
            "size",
            "sort",
            "code",
            "discountType",
            "discountValue",
            "target",
            "description",
            "minimumOrderAmount",
            "maxUsage",
            "startDate",
            "endDate",
            "createdAt",
            "updatedAt",
            "product",
            "category",
        ];

        return Object.fromEntries(
            Object.entries(value).filter(([key]) => allowedFields.includes(key))
        );
    }),

    query("product").customSanitizer((value) => {
        if (!value) return value;

        const allowedFields = ["name", "productID", "createdAt"];
        return Object.fromEntries(
            Object.entries(value).filter(([key]) => allowedFields.includes(key))
        );
    }),
];

export {
    validateCreateCoupon,
    validatePatchCoupon,
    validateAddCategoriesCoupon,
    validateAddProductsCoupon,
    validateQueryGetCoupon,
};
