import { Router } from "express";

import variantController from "../../../controllers/products/variants.controller.js";
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

variantRoute.get(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.getProductVariant
);

variantRoute.post(
    "/products/:productID/variants",
    validator.validateCreateVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.addProductVariants
);

variantRoute.get(
    "/variants",
    validator.validateQueryGetVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.getVariants
);

variantRoute.get(
    "/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.getVariant
);

variantRoute.put(
    "/variants/:variantID",
    validator.validatePutVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.putVariant
);

variantRoute.patch(
    "/variants/:variantID",
    validator.validatePatchVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.patchVariant
);

variantRoute.delete(
    "/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.deleteVariant
);

export default variantRoute;
