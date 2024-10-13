import { body, query } from "express-validator";
import {
    sanitizeSortingQuery,
    validateSortingQuery,
    validateQueryDate,
    validateQueryInteger,
    validateQueryNumber,
    validateQueryString,
} from "../utils.validator.js";
import { validateCreateAddress } from "../users/address.validator.js";

const validatePostOrder = [
    body("payment")
        .notEmpty()
        .withMessage("Payment is required")
        .isString()
        .withMessage("Payment should be a string")
        .custom((value) => {
            if (!["cod", "momo", "credit_card"].includes(value.toLowerCase())) {
                throw new Error("Invalid payment method");
            }

            return true;
        })
        .customSanitizer((value) => {
            if (typeof value !== "string") {
                return value;
            }

            switch (value.toLowerCase()) {
                case "cod":
                    return "COD";
                case "momo":
                    return "Momo";
                case "credit_card":
                    return "CreditCard";
                default:
                    return value;
            }
        }),
];

const validatePatchOrder = [
    body("message")
        .optional()
        .custom((value) => {
            if (value === null) {
                return true;
            }

            if (typeof value !== "string") {
                throw new Error("Message should be a string");
            }

            return true;
        }),

    body("addressID")
        .optional()
        .isString()
        .withMessage("Address ID should be a string"),

    body("address")
        .optional()
        .isObject()
        .withMessage("Address should be an object"),

    body("address.city")
        .if(body("address").exists())
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City should be a string"),

    body("address.district")
        .if(body("address").exists())
        .notEmpty()
        .withMessage("District is required")
        .isString()
        .withMessage("District should be a string"),

    body("address.address")
        .if(body("address").exists())
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address should be a string"),

    body("address.recipientName")
        .if(body("address").exists())
        .notEmpty()
        .withMessage("RecipientName is required")
        .isString()
        .withMessage("RecipientName should be a string"),

    body("address.phoneNumber")
        .if(body("address").exists())
        .notEmpty()
        .withMessage("PhoneNumber is required")
        .isString()
        .withMessage("PhoneNumber should be a string"),
];

const validateApplyCoupon = [
    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isString()
        .withMessage("Code should be a string"),
];

const validateQueryGetOrderUser = [
    // Validate query parameters
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "status",
                "paymentMethod",
                "subTotal",
                "finalTotal",
                "createdAt",
                "updatedAt",
            ])
        ),

    query("orderID").optional().custom(validateQueryString("OrderID")),

    query("status").optional().custom(validateQueryString("Status")),

    query("paymentMethod")
        .optional()
        .custom(validateQueryString("PaymentMethod")),

    query("subTotal").optional().custom(validateQueryNumber("SubTotal")),

    query("finalTotal").optional().custom(validateQueryNumber("FinalTotal")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),
];

const validateQueryGetOrderAdmin = [
    // Validate query parameters
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "orderID",
                "status",
                "subTotal",
                "finalTotal",
                "paymentMethod",
                "userID",
                "couponID",
                "shippingAddressID",
                "createdAt",
                "updatedAt",
                "deletedAt",
            ])
        ),

    query("orderID").optional().custom(validateQueryString("OrderID")),

    query("status").optional().custom(validateQueryString("Status")),

    query("paymentMethod")
        .optional()
        .custom(validateQueryString("PaymentMethod")),

    query("subTotal").optional().custom(validateQueryNumber("SubTotal")),

    query("finalTotal").optional().custom(validateQueryNumber("FinalTotal")),

    query("userID").optional().custom(validateQueryString("UserID")),

    query("couponID").optional().custom(validateQueryString("CouponID")),

    query("couponCode").optional().custom(validateQueryString("CouponCode")),

    query("shippingAddressID")
        .optional()
        .custom(validateQueryString("ShippingAddressID")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("deletedAt").optional().custom(validateQueryDate("DeletedAt")),

    query("variant")
        .optional()
        .isObject()
        .withMessage("Variant should be an object"),

    query("variant.variantID")
        .optional()
        .custom(validateQueryString("VariantID")),

    query("variant.productID")
        .optional()
        .custom(validateQueryString("ProductID")),

    query("variant.name").optional().custom(validateQueryString("Name")),

    query("variant.price").optional().custom(validateQueryNumber("Price")),

    query("variant.discountPrice")
        .optional()
        .custom(validateQueryNumber("DiscountPrice")),

    query("variant.stock").optional().custom(validateQueryNumber("Stock")),

    query("variant.sku").optional().custom(validateQueryString("SKU")),

    query("shippingAddress.city")
        .optional()
        .custom(validateQueryString("City")),

    query("shippingAddress.district")
        .optional()
        .custom(validateQueryString("District")),

    query("shippingAddress.address")
        .optional()
        .custom(validateQueryString("Address")),
];

const validateUpdateOrderStatus = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status should be a string")
        .custom((value) => {
            if (
                ![
                    "pending",
                    "processing",
                    "shipping",
                    "completed",
                    "cancelled",
                ].includes(value.toLowerCase())
            ) {
                throw new Error("Invalid status");
            }

            return true;
        }),
];

const validateCreateOrderAdmin = [
    body("variants")
        .notEmpty()
        .withMessage("Variants is required")
        .isArray()
        .withMessage("Variants should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Variants should not be empty");
            }

            return true;
        }),

    body("variants.*.variantID")
        .notEmpty()
        .withMessage("VariantID is required")
        .isString()
        .withMessage("VariantID should be a string"),

    body("variants.*.quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity should be an integer greater than 0"),

    body("couponCode")
        .optional()
        .isString()
        .withMessage("CouponCode should be a string"),
];

export {
    validatePostOrder,
    validatePatchOrder,
    validateApplyCoupon,
    validateQueryGetOrderUser,
    validateQueryGetOrderAdmin,
    validateUpdateOrderStatus,
    validateCreateOrderAdmin,
};
