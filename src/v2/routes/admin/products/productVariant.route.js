import { Router } from "express";

import variantController from "../../../controllers/products/variants.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middleware.js";
import validator from "../../../middlewares/validators/index.validator.js";
import { imageConfig } from "../../../config/config.js";

const productVariantRoute = Router();

productVariantRoute.get(
    "/products/:productID/variants",
    verifyToken,
    isAdmin,
    variantController.getProductVariants
);

productVariantRoute.get(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.getProductVariant
);

productVariantRoute.post(
    "/products/:productID/variants",
    imageConfig.upload.array("images", imageConfig.MAX_COUNT),
    validator.handleValidationFileUpload,
    validator.validateCreateVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.addProductVariants
);

export default productVariantRoute;
