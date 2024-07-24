import { body } from "express-validator";
import {
    validateInteger,
    validateMinValue,
    validateNumber,
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
            if (value.startDate.getTime() > value.endDate.getTime()) {
                throw new Error("Start date should be before end date");
            }
        }

        return true;
    }),
];

const validatePutCoupon = [
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
        .withMessage("End date should be a string of date")
        .isISO8601()
        .withMessage("End date should be a valid date (ISO8601)")
        .toDate(),

    body().custom((value) => {
        if (value.startDate && value.endDate) {
            if (value.startDate.getTime() > value.endDate.getTime()) {
                throw new Error("Start date should be before end date");
            }
        }

        return true;
    }),
];

const validatePatchCoupon = [
    body("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    body("discountValue")
        .optional()
        .custom(validateNumber("Discount value"))
        .custom(validateMinValue("Discount value", 0)),

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

    body("endDate")
        .optional()
        .isString()
        .withMessage("Start date should be a string of date")
        .isISO8601()
        .withMessage("End date should be a valid date (ISO8601)")
        .toDate(),
];

export { validateCreateCoupon, validatePutCoupon, validatePatchCoupon };
