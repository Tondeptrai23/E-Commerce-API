import { Router } from "express";

import attributeController from "../../../controllers/products/attributes.controller.js";

import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";

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

// adminAttributeRoute.post(
//     "/attributes",
//     validator.validateCreateAttribute,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.createAttribute
// );

// adminAttributeRoute.patch(
//     "/attributes/:attributeID",
//     validator.validatePatchAttribute,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.renameAttribute
// );

// adminAttributeRoute.put(
//     "/attributes/:attributeID",
//     validator.validatePutAttribute,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.replaceAttribute
// );

// adminAttributeRoute.delete(
//     "/attributes/:attributeID",
//     verifyToken,
//     isAdmin,
//     attributeController.deleteAttribute
// );

// adminAttributeRoute.post(
//     "/attributes/:attributeID",
//     validator.validateCreateAttributeValue,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.createAttributeValue
// );

// adminAttributeRoute.patch(
//     "/attributes/:attributeID/values/:valueID",
//     validator.validatePatchAttributeValue,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.renameAttributeValue
// );

// adminAttributeRoute.put(
//     "/attributes/:attributeID/values/:valueID",
//     validator.validatePutAttributeValue,
//     validator.handleValidationErrors,
//     verifyToken,
//     isAdmin,
//     attributeController.replaceAttributeValue
// );

// adminAttributeRoute.delete(
//     "/attributes/:attributeID/values/:valueID",
//     verifyToken,
//     isAdmin,
//     attributeController.deleteAttributeValue
// );

// adminAttributeRoute.get(
//     "/attributes/:attributeID/variants",
//     verifyToken,
//     isAdmin,
//     attributeController.getAttributeVariants
// );

export default adminAttributeRoute;
