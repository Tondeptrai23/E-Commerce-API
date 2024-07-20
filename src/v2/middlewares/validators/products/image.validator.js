import { body } from "express-validator";

const validateCreateImages = [
    body("images")
        .notEmpty()
        .withMessage("Images is required")
        .isArray()
        .withMessage("Images should be an array")
        .isLength({
            min: 1,
        })
        .withMessage("Images should have at least one item"),

    // Validate image url
    body("images.*.url")
        .notEmpty()
        .withMessage("URL is required")
        .isString()
        .withMessage("URL should be a string"),

    // Validate thumbnail
    body("images.*.thumbnail")
        .optional()
        .isString()
        .withMessage("Thumbnail should be a string"),
];

const validatePatchImage = [
    body("imageID").not().exists().withMessage("Id should not be provided"),

    body("url").optional().isString().withMessage("URL should be a string"),

    body("thumbnail")
        .optional()
        .isString()
        .withMessage("Thumbnail should be a string"),

    body("displayOrder")
        .not()
        .exists()
        .withMessage(
            "Display order should not be provided. Use POST /images/reorder instead"
        ),
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
        .isInt({
            min: 1,
        })
        .withMessage("Display order should be an integer greater than 0"),
];

export { validateCreateImages, validatePatchImage, validateReorderImages };
