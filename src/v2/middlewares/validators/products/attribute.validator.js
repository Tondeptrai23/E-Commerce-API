import { query, body } from "express-validator";
import {
    sanitizeSortingQuery,
    validateQueryInteger,
    validateQueryString,
    validateQueryDate,
    validateSortingQuery,
    validateQueryNumber,
} from "../utils.validator.js";

const validatePostAttribute = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),

    body("values")
        .optional()
        .isArray()
        .withMessage("Values should be an array")
        .custom((values) => {
            if (values.length === 0) {
                throw new Error("Values should have at least one value");
            }
            return true;
        })
        .custom((values) => {
            const uniqueValues = new Set(values);
            if (uniqueValues.size !== values.length) {
                throw new Error("Values should be unique");
            }
            return true;
        }),

    body("values.*").isString().withMessage("Value should be a string"),
];

const validatePatchAttribute = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),
];

const validateQueryGetVariants = [
    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("sort")
        .optional()
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "variantID",
                "productID",
                "price",
                "name",
                "discountPrice",
                "stock",
                "createdAt",
                "updatedAt",
                "deletedAt",
            ])
        ),

    query("variantID").optional().custom(validateQueryString("VariantID")),

    query("name").optional().custom(validateQueryString("Name")),

    query("price").optional().custom(validateQueryNumber("Price")),

    query("discountPrice")
        .optional()
        .custom(validateQueryNumber("Discount price")),

    query("stock").optional().custom(validateQueryNumber("Stock")),

    query("sku").optional().custom(validateQueryString("SKU")),

    query("productID").optional().custom(validateQueryString("ProductID")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),

    query("deletedAt").optional().custom(validateQueryDate("DeletedAt")),
];

const validateQueryGetAttribute = [
    query("sort")
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "attributeID",
                "name",
                "updatedAt",
                "createdAt",
            ])
        ),

    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("attributeID").optional().custom(validateQueryString("AttributeID")),

    query("name").optional().custom(validateQueryString("Name")),

    query("values").optional().custom(validateQueryString("Values")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),
];

const validatePostAttributeValue = [
    body("value")
        .notEmpty()
        .withMessage("Value is required")
        .isString()
        .withMessage("Value should be a string"),
];

const validateQueryGetAttributeValue = [
    query("sort")
        .customSanitizer(sanitizeSortingQuery)
        .custom(
            validateSortingQuery([
                "valueID",
                "attributeID",
                "value",
                "updatedAt",
                "createdAt",
            ])
        ),

    query("page").optional().custom(validateQueryInteger("Page")),

    query("size").optional().custom(validateQueryInteger("Size")),

    query("valueID").optional().custom(validateQueryString("ValueID")),

    query("value").optional().custom(validateQueryString("Value")),

    query("attributeID").optional().custom(validateQueryString("AttributeID")),

    query("attributeName")
        .optional()
        .custom(validateQueryString("AttributeName")),

    query("updatedAt").optional().custom(validateQueryDate("UpdatedAt")),

    query("createdAt").optional().custom(validateQueryDate("CreatedAt")),
];

export {
    validateQueryGetAttribute,
    validatePatchAttribute,
    validatePostAttribute,
    validateQueryGetAttributeValue,
    validatePostAttributeValue,
    validateQueryGetVariants,
};
