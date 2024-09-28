import { body, query } from "express-validator";
import {
    validateUnexpectedFields,
    validateQueryInteger,
} from "../utils.validator.js";

const validateCreateAddress = [
    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address should be a string"),

    body("city")
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City should be a string"),

    body("district")
        .notEmpty()
        .withMessage("District is required")
        .isString()
        .withMessage("District should be a string"),

    body("recipientName")
        .notEmpty()
        .withMessage("Recipient Name is required")
        .isString()
        .withMessage("RecipientName should be a string"),

    body("phoneNumber")
        .notEmpty()
        .withMessage("PhoneNumber is required")
        .isString()
        .withMessage("PhoneNumber should be a string"),

    body().custom(
        validateUnexpectedFields([
            "address",
            "city",
            "district",
            "recipientName",
            "phoneNumber",
        ])
    ),
];

const validatePutAddress = [
    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address should be a string"),

    body("city")
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City should be a string"),

    body("district")
        .notEmpty()
        .withMessage("District is required")
        .isString()
        .withMessage("District should be a string"),

    body("recipientName")
        .notEmpty()
        .withMessage("Recipient Name is required")
        .isString()
        .withMessage("RecipientName should be a string"),

    body("phoneNumber")
        .notEmpty()
        .withMessage("PhoneNumber is required")
        .isString()
        .withMessage("PhoneNumber should be a string"),

    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("IsDefault should be a boolean"),

    body().custom(
        validateUnexpectedFields([
            "address",
            "city",
            "district",
            "recipientName",
            "phoneNumber",
            "isDefault",
        ])
    ),
];

const validateQueryAddressUser = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),
];

export { validateCreateAddress, validatePutAddress, validateQueryAddressUser };
