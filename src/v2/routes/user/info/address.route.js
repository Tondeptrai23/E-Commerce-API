import { Router } from "express";
import addressController from "../../../controllers/users/address.controller.js";

import { verifyToken } from "../../../middlewares/auth/authJwt.middlewares.js";

const userAddressRoute = Router();
userAddressRoute.get("/", verifyToken, addressController.getUserAddresses);

userAddressRoute.get(
    "/:addressID",
    verifyToken,
    addressController.getUserAddress
);

userAddressRoute.post("/", verifyToken, addressController.postAddress);

userAddressRoute.put("/:addressID", verifyToken, addressController.putAddress);

userAddressRoute.delete(
    "/:addressID",
    verifyToken,
    addressController.deleteAddress
);

export default userAddressRoute;
