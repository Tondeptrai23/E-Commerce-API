import { Router } from "express";

import cartController from "../../controllers/cart.controller.js";

const adminCartRoute = Router();

adminCartRoute.get("/:userID/cart/", cartController.getCart);

export default adminCartRoute;
