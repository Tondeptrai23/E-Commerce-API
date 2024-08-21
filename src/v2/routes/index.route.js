import { Router } from "express";

import authRoute from "./auth.route.js";
import adminCartRoute from "./admin/cart.route.js";
import adminOrderRoute from "./admin/orders.route.js";
import adminProductRoute from "./admin/products/products.route.js";
import adminUserRoute from "./admin/users.route.js";
import adminCategoryRoute from "./admin/categories.route.js";
import adminCouponRoute from "./admin/coupons.route.js";
import adminVariantRoute from "./admin/variants.route.js";

import userCartRoute from "./user/cart.route.js";
import userOrderRoute from "./user/orders.route.js";
import userProductRoute from "./user/products.route.js";
import userCategoryRoute from "./user/categories.route.js";

const router = Router();

router.use("/auth", authRoute);

router.use("/cart", userCartRoute);
router.use("/orders", userOrderRoute);
router.use("/products", userProductRoute);
router.use("/categories", userCategoryRoute);

router.use("/admin", adminCartRoute);
router.use("/admin", adminProductRoute);
router.use("/admin", adminOrderRoute);
router.use("/admin", adminUserRoute);
router.use("/admin", adminCategoryRoute);
router.use("/admin", adminCouponRoute);
router.use("/admin", adminVariantRoute);

export { router };
