import { Router } from "express";

import attributeController from "../../../controllers/products/attributes.controller.js";

import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middleware.js";

import validator from "../../../middlewares/validators/index.validator.js";

const adminAttributeRoute = Router();

adminAttributeRoute.get(
    "/attributes",
    validator.validateQueryGetAttribute,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeController.getAttributes
);

adminAttributeRoute.get(
    "/attributes/:attributeID",
    verifyToken,
    isAdmin,
    attributeController.getAttribute
);

adminAttributeRoute.post(
    "/attributes",
    validator.validateCreateAttribute,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeController.createAttribute
);

adminAttributeRoute.patch(
    "/attributes/:attributeID",
    validator.validatePatchAttribute,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeController.renameAttribute
);

adminAttributeRoute.put(
    "/attributes/:attributeID",
    validator.validateCreateAttribute,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeController.replaceAttribute
);

adminAttributeRoute.delete(
    "/attributes/:attributeID",
    verifyToken,
    isAdmin,
    attributeController.deleteAttribute
);

adminAttributeRoute.get(
    "/attributes/:attributeID/variants",
    validator.validateQueryGetAttributeVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeController.getAttributeVariants
);

export default adminAttributeRoute;
