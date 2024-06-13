import { Router } from "express";

import userController from "../../controllers/user.controller.js";

const adminUserRoute = Router();

adminUserRoute.get("/users", userController.getUsers);

adminUserRoute.get("/users/:userID", userController.getUser);

export default adminUserRoute;
