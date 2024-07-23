import { body } from "express-validator";

const validatePostOrder = [];

const validatePatchOrder = [
    body("message")
        .optional()
        .isString()
        .withMessage("Message should be a string"),

    body("addressID")
        .optional()
        .isString()
        .withMessage("Address ID should be a string"),
];

const validateApplyCoupon = [
    body("couponCode")
        .notEmpty()
        .withMessage("Coupon code is required")
        .isString()
        .withMessage("Coupon code should be a string"),
];

export { validatePostOrder, validatePatchOrder, validateApplyCoupon };
