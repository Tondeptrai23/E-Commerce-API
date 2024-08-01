import { Router } from "express";

import categoryController from "../../controllers/products/categories.controller.js";

const userCategoryRoute = Router();

userCategoryRoute.get("/", categoryController.getCategories);

userCategoryRoute.get("/:name", categoryController.getCategory);

userCategoryRoute.get(
    "/:name/ascendant",
    categoryController.getAscendantCategories
);

userCategoryRoute.get(
    "/:name/descendant",
    categoryController.getDescendantCategories
);

export default userCategoryRoute;
