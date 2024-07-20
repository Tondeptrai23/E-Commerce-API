import { body } from "express-validator";
import categoryService from "../../../services/products/category.service.js";

const validateAddCategoriesForProduct = [
    body("categories")
        .notEmpty()
        .isArray()
        .withMessage("Categories should be an array")
        .isLength({
            min: 1,
        })
        .withMessage("Categories should have at least one item"),

    body("categories.*").isString().withMessage("Category should be a string"),

    body("categories").custom(async (value) => {
        const categories = await categoryService.getCategoryNames();

        value.map((category) => {
            if (!categories.includes(category)) {
                throw new Error("Category does not exist");
            }
        });
    }),
];

export { validateAddCategoriesForProduct };
