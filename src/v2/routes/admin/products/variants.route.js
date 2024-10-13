import { Router } from "express";

import validator from "../../../validators/index.validator.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/authJwt.middleware.js";

import variantController from "../../../controllers/products/variants.controller.js";

const adminVariantRoute = Router();

adminVariantRoute.get(
    "/variants",
    validator.validateQueryGetVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.getVariants
);

adminVariantRoute.get(
    "/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.getVariant
);

adminVariantRoute.post(
    "/variants/:variantID/quantity",
    validator.validatePostVariantQuantity,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.postVariantQuantity
);

adminVariantRoute.put(
    "/variants/:variantID",
    validator.validatePutVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.putVariant
);

adminVariantRoute.patch(
    "/variants/:variantID",
    validator.validatePatchVariant,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    variantController.patchVariant
);

adminVariantRoute.delete(
    "/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.deleteVariant
);

export default adminVariantRoute;
