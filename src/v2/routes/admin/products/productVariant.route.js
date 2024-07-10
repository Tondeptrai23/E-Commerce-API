import { Router } from "express";

import variantController from "../../../controllers/variant.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/authJwt.js";

const variantRoute = Router();

variantRoute.get(
    "/products/:productID/variants",
    verifyToken,
    isAdmin,
    variantController.getProductVariants
);

variantRoute.post(
    "/products/:productID/variants",
    verifyToken,
    isAdmin,
    variantController.addProductVariant
);

variantRoute.put(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.updateProductVariant
);

variantRoute.delete(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.deleteProductVariant
);

export default variantRoute;
