import { Router } from "express";

import categoryController from "../../../controllers/products/categories.controller.js";
import validator from "../../../middlewares/validators/index.validator.js";

const userCategoryRoute = Router();

userCategoryRoute.get(
    "/",
    validator.validateQueryGetCategoryUser,
    validator.handleValidationErrors,
    categoryController.getCategories
);

userCategoryRoute.get("/:name", categoryController.getCategory);

userCategoryRoute.get(
    "/:name/ascendants",
    categoryController.getAscendantCategories
);

userCategoryRoute.get(
    "/:name/descendants",
    categoryController.getDescendantCategories
);

export default userCategoryRoute;
