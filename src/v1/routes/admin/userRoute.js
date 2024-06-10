import { Router } from "express";

import { UserController } from "../../controllers/userController.js";
import { isAdmin, verifyToken } from "../../middlewares/authJwt.js";

const router = Router();

router.get("/users", verifyToken, isAdmin, UserController.getAllUsers);

router.get("/users/:userId", verifyToken, isAdmin, UserController.getUser);

export { router as adminUserRoute };
