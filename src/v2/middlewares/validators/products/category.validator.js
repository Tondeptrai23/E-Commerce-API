import { body } from "express-validator";

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

export { validateAddCategoriesForProduct, validatePutCategoriesForProduct };
