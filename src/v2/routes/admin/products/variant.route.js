import { Router } from "express";

import variantController from "../../../controllers/products/variant.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../../middlewares/validators/index.validator.js";

const variantRoute = Router();

variantRoute.get(
    "/products/:productID/variants",
    verifyToken,
    isAdmin,
    variantController.getProductVariants
);

variantRoute.post(
    "/products/:productID/variants",
    validator.validateCreateVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.addProductVariant
);

variantRoute.put(
    "/products/:productID/variants/:variantID",
    validator.validatePutVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.putProductVariant
);

variantRoute.patch(
    "/products/:productID/variants/:variantID",
    validator.validatePatchVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.patchProductVariant
);

variantRoute.delete(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.deleteProductVariant
);

export default variantRoute;
