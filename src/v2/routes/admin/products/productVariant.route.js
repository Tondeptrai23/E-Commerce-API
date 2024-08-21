import { Router } from "express";

import variantController from "../../../controllers/products/variants.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../../middlewares/validators/index.validator.js";

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
    validator.validateCreateVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.addProductVariants
);

export default productVariantRoute;
