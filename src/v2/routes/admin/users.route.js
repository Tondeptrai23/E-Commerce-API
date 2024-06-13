import { Router } from "express";

import userController from "../../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../../middlewares/authJwt.js";

const adminUserRoute = Router();

adminUserRoute.get("/users", verifyToken, isAdmin, userController.getUsers);

adminUserRoute.get("/users/:userID", userController.getUser);

export default adminUserRoute;
