import { Router } from "express";

import userController from "../../../controllers/users/user.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/authJwt.middleware.js";
import validator from "../../../validators/index.validator.js";

const adminUserRoute = Router();

adminUserRoute.get("/users", verifyToken, isAdmin, userController.getUsers);

adminUserRoute.get(
    "/users/:userID",
    validator.validateQueryGetUser,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    userController.getUser
);

adminUserRoute.post(
    "/users",
    validator.validateCreateUser,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    userController.createUser
);

adminUserRoute.patch(
    "/users/:userID",
    validator.validateUpdateUser,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    userController.updateUser
);

adminUserRoute.post(
    "/users/:userID/verify",
    verifyToken,
    isAdmin,
    userController.verifyUser
);

adminUserRoute.delete(
    "/users/:userID",
    verifyToken,
    isAdmin,
    userController.deleteUser
);

export default adminUserRoute;
