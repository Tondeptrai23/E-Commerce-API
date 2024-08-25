import { Router } from "express";
import attributeValuesController from "../../../controllers/products/attributeValues.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";

const adminAttributeValuesRoute = Router();

adminAttributeValuesRoute.get(
    "/attributes/values",
    verifyToken,
    isAdmin,
    attributeValuesController.getAttributeValues
);

adminAttributeValuesRoute.post(
    "/attributes/:attributeID/values",
    // validator.validateCreateAttributeValue,
    // validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.createAttributeValue
);

adminAttributeValuesRoute.patch(
    "/attributes/:attributeID/values/:valueID",
    // validator.validatePatchAttributeValue,
    // validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    attributeValuesController.renameAttributeValue
);

adminAttributeValuesRoute.put(
    "/attributes/:attributeID/values/:valueID",
    // validator.validatePutAttributeValue,
    // validator.handleValidationErrors,
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
    verifyToken,
    isAdmin,
    attributeValuesController.getAttributeValueVariants
);

export default adminAttributeValuesRoute;
