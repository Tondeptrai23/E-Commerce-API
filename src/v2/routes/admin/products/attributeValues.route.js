import { Router } from "express";
import attributeValuesController from "../../../controllers/products/attributeValues.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../../middlewares/validators/index.validator.js";

const adminAttributeValuesRoute = Router();

adminAttributeValuesRoute.get(
    "/attributeValues",
    validator.validateQueryGetAttributeValue,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.getAttributeValues
);

adminAttributeValuesRoute.post(
    "/attributes/:attributeID/values",
    validator.validateCreateAttributeValue,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.createAttributeValue
);

adminAttributeValuesRoute.patch(
    "/attributes/:attributeID/values/:valueID",
    validator.validateCreateAttributeValue,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.renameAttributeValue
);

adminAttributeValuesRoute.put(
    "/attributes/:attributeID/values/:valueID",
    validator.validateCreateAttributeValue,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.replaceAttributeValue
);

adminAttributeValuesRoute.delete(
    "/attributes/:attributeID/values/:valueID",
    verifyToken,
    isAdmin,
    attributeValuesController.deleteAttributeValue
);

adminAttributeValuesRoute.get(
    "/attributes/:attributeID/values/:valueID/variants",
    validator.validateQueryGetAttributeVariants,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.getAttributeValueVariants
);

export default adminAttributeValuesRoute;
