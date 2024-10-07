import { body, header } from "express-validator";
import { validateInteger, validateMinValue } from "../utils.validator.js";

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
        .isLength({
            min: 1,
        })
        .withMessage("Images should have at least one item"),

    body("images.*.imageID")
        .notEmpty()
        .withMessage("Image ID is required")
        .isString()
        .withMessage("Image ID should be a string"),

    body("images.*.displayOrder")
        .notEmpty()
        .withMessage("Display order is required")
        .custom(validateInteger("Display order"))
        .custom(validateMinValue("Display order", 1)),
];

export { validateCreateImages, validateReorderImages };
