import { Router } from "express";

import userController from "../../controllers/users/user.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../middlewares/auth/authJwt.middlewares.js";

const adminUserRoute = Router();

adminUserRoute.get("/users", verifyToken, isAdmin, userController.getUsers);

adminUserRoute.get("/users/:userID", userController.getUser);

export default adminUserRoute;
