import { body } from "express-validator";
import categoryService from "../../../services/products/category.service.js";

const validateAddCategoriesForProduct = [
    body("categories")
        .notEmpty()
        .isArray()
        .withMessage("Categories should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Categories should have at least one item");
            }
            return true;
        }),

    body("categories.*").isString().withMessage("Category should be a string"),

    body("categories").custom(async (value) => {
        if (!value) {
            return;
        }
        const categories = await categoryService.getCategoryNames();

        for (const category of value) {
            if (!categories.includes(category)) {
                throw new Error("Category does not exist");
            }
        }
    }),
];

const validatePutCategoriesForProduct = [
    body("categories")
        .notEmpty()
        .isArray()
        .withMessage("Categories should be an array"),

    body("categories.*").isString().withMessage("Category should be a string"),

    body("categories").custom(async (value) => {
        if (!value) {
            return;
        }
        const categories = await categoryService.getCategoryNames();

        for (const category of value) {
            if (!categories.includes(category)) {
                throw new Error("Category does not exist");
            }
        }
    }),
];

export { validateAddCategoriesForProduct, validatePutCategoriesForProduct };
