import { body, query } from "express-validator";
import {
    sanitizeSortingQuery,
    validateSortingQuery,
    validateQueryDate,
    validateQueryInteger,
    validateQueryNumber,
    validateQueryString,
} from "../utils.validator.js";

const validatePostOrder = [
    body("payment")
        .notEmpty()
        .withMessage("Payment is required")
        .isString()
        .withMessage("Payment should be a string")
        .custom((value) => {
            if (!["cod", "momo", "creditcart"].includes(value.toLowerCase())) {
                throw new Error("Invalid payment method");
            }

            return true;
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

export {
    validatePostOrder,
    validatePatchOrder,
    validateApplyCoupon,
    validateQueryGetOrderUser,
    validateQueryGetOrderAdmin,
};
