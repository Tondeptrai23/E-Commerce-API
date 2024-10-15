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
import couponService from "../../services/shopping/coupon.service.js";

const validateCreateCoupon = [
    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isString()
        .withMessage("Code should be a string"),

    body("discountType")
        .notEmpty()
        .withMessage("DiscountType is required")
        .isIn(["percentage", "fixed"])
        .withMessage("DiscountType should be valid"),

    body("discountValue")
        .notEmpty()
        .withMessage("DiscountValue is required")
        .custom(validateNumber("DiscountValue"))
        .custom(validateMinValue("DiscountValue", 0))
        .custom((value, { req }) => {
            if (req.body.discountType === "percentage" && value > 100) {
                throw new Error(
                    "DiscountValue should be less than 100 for percentage discount"
                );
            }

            return true;
        }),

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
        .custom(validateNumber("MinimumOrderAmount"))
        .custom(validateMinValue("MinimumOrderAmount", 0)),

    body("maximumDiscountAmount")
        .optional()
        .custom(validateNumber("MaximumDiscountAmount"))
        .custom(validateMinValue("MaximumDiscountAmount", 0)),

    body("maxUsage")
        .optional()
        .custom(validateInteger("MaxUsage"))
        .custom(validateMinValue("MaxUsage", 0)),

    body("startDate")
        .optional()
        .isString()
        .withMessage("StartDate should be a string of date")
        .isISO8601()
        .withMessage("StartDate should be a valid date (ISO8601)")
        .toDate(),

    body("endDate")
        .optional()
        .isString()
        .withMessage("EndDate should be a string of date")
        .isISO8601()
        .withMessage("EndDate should be a valid date (ISO8601)")
        .toDate(),

    body().custom((value) => {
        if (value.startDate && value.endDate) {
            if (
                new Date(value.startDate).getTime() >
                new Date(value.endDate).getTime()
            ) {
                throw new Error("StartDate should be before endDate");
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
            "maximumDiscountAmount",
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
        .custom(validateNumber("MinimumOrderAmount"))
        .custom(validateMinValue("MinimumOrderAmount", 0)),

    body("maximumDiscountAmount")
        .optional()
        .custom(validateNumber("MaximumDiscountAmount"))
        .custom(validateMinValue("MaximumDiscountAmount", 0)),

    body("maxUsage")
        .optional()
        .custom(validateInteger("MaxUsage"))
        .custom(validateMinValue("MaxUsage", 0)),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("StartDate should be a valid date (ISO8601)"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("EndDate should be a valid date (ISO8601)"),

    body().custom(async (value, { req }) => {
        let coupon;
        try {
            coupon = await couponService.getCoupon(req.params.couponID);
        } catch (err) {
            // Ignore error
            return true;
        }

        const udpatedCoupon = coupon.set(value);
        if (udpatedCoupon.startDate && udpatedCoupon.endDate) {
            if (
                new Date(udpatedCoupon.startDate).getTime() >
                new Date(udpatedCoupon.endDate).getTime()
            ) {
                throw new Error("StartDate should be before endDate");
            }
        }

        return true;
    }),

    body().custom(
        validateUnexpectedFields([
            "description",
            "minimumOrderAmount",
            "maximumDiscountAmount",
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
                "maximumDiscountAmount",
                "maxUsage",
                "startDate",
                "endDate",
                "createdAt",
                "updatedAt",
            ])
        ),

    query("couponID").optional().custom(validateQueryString("Coupon ID")),

    query("code").optional().custom(validateQueryString("Code")),

    query("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("DiscountType should be valid"),

    query("discountValue")
        .optional()
        .custom(validateQueryNumber("DiscountValue")),

    query("target")
        .optional()
        .isIn(["all", "single"])
        .withMessage("Target should be valid"),

    query("minimumOrderAmount")
        .optional()
        .custom(validateQueryNumber("MinimumOrderAmount")),

    query("maximumDiscountAmount")
        .optional()
        .custom(validateQueryNumber("MaximumDiscountAmount")),

    query("maxUsage").optional().custom(validateQueryNumber("MaxUsage")),

    query("startDate").optional().custom(validateQueryDate("StartDate")),

    query("endDate").optional().custom(validateQueryDate("EndDate")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("product")
        .optional()
        .isObject()
        .withMessage("Product should be an object"),

    query("product.name").optional().custom(validateQueryString("ProductName")),

    query("product.productID")
        .optional()
        .custom(validateQueryString("ProductID")),

    query("product.createdAt")
        .optional()
        .custom(validateQueryDate("ProductCreatedAt")),

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
];

export {
    validateCreateCoupon,
    validatePatchCoupon,
    validateAddCategoriesCoupon,
    validateAddProductsCoupon,
    validateQueryGetCoupon,
};
