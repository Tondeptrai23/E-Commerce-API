import { Router } from "express";

import validator from "../../../middlewares/validators/index.validator.js";
import addressController from "../../../controllers/users/address.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middleware.js";

const adminAddressRoute = Router();

adminAddressRoute.get(
    "/users/:userID/address",
    validator.validateQueryAddressUser,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    addressController.getUserAddressesAdmin
);

adminAddressRoute.get(
    "/users/:userID/address/:addressID",
    verifyToken,
    isAdmin,
    addressController.getUserAddressAdmin
);

adminAddressRoute.get(
    "/address/shipping/:shippingAddressID",
    verifyToken,
    isAdmin,
    addressController.getShippingAddress
);

export default adminAddressRoute;
