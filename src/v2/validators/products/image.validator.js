import { body, header } from "express-validator";

const validateCreateImages = [
    header("Content-Type").custom((value) => {
        if (!value || value.includes("multipart/form-data") === false) {
            throw new Error("Content-Type should be multipart/form-data");
        }

        return true;
    }),
];

const validateReorderImages = [
    body("images")
        .notEmpty()
        .withMessage("Images is required")
        .isArray()
        .withMessage("Images should be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Images should have at least one item");
            }

            return true;
        }),

    body("images.*").isString().withMessage("Image should be a string"),
];

export { validateCreateImages, validateReorderImages };
