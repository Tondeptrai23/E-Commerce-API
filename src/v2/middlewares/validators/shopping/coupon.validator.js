import { body } from "express-validator";

const validateCreateCoupon = [
    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isAlphanumeric()
        .withMessage("Code should be an alphanumeric string"),

    body("discountType")
        .notEmpty()
        .withMessage("Discount type is required")
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    body("discountValue")
        .notEmpty()
        .withMessage("Discount value is required")
        .isNumeric()
        .withMessage("Discount value should be a number"),

    body("minimumOrderAmount")
        .optional()
        .isInt({
            min: 0,
        })
        .withMessage(
            "Minimum order amount should be an integer greater than or equal to 0"
        )
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
        .isInt({
            min: 0,
        })
        .withMessage(
            "Max usage should be an integer greater than or equal to 0"
        ),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date should be a valid date"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date should be a valid date"),
];

const validatePutCoupon = [
    body("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    body("discountValue")
        .optional()
        .isNumeric()
        .withMessage("Discount value should be a number"),

    body("minimumOrderAmount")
        .optional()
        .isInt({
            min: 0,
        })
        .withMessage(
            "Minimum order amount should be an integer greater than or equal to 0"
        )
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
        .isInt({
            min: 0,
        })
        .withMessage(
            "Max usage should be an integer greater than or equal to 0"
        ),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date should be a valid date"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date should be a valid date"),
];

const validatePatchCoupon = [
    body("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("Discount type should be valid"),

    body("discountValue")
        .optional()
        .isNumeric()
        .withMessage("Discount value should be a number"),

    body("minimumOrderAmount")
        .optional()
        .isInt({
            min: 0,
        })
        .withMessage(
            "Minimum order amount should be an integer greater than or equal to 0"
        )
        .custom((value, { req }) => {
            if (req.body.discountType === "percentage" && value > 100) {
                throw new Error(
                    "Minimum order amount should be less than 100 for percentage discount"
                );
            }

            return true;
        }),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date should be a valid date"),
];

export { validateCreateCoupon, validatePutCoupon, validatePatchCoupon };
