import { Router } from "express";

import { userCartRoute } from "./user/cartRoute.js";
import { userOrderRoute } from "./user/orderRoute.js";
import { userProductRoute } from "./user/productRoute.js";
import { adminCartRoute } from "./admin/cartRoute.js";
import { adminOrderRoute } from "./admin/orderRoute.js";
import { adminProductRoute } from "./admin/productRoute.js";
import { adminUserRoute } from "./admin/userRoute.js";
import { authRoute } from "./authRoute.js";

const router = Router();

router.use("/api/auth", authRoute);

router.use("/api/cart", userCartRoute);
router.use("/api/orders", userOrderRoute);
router.use("/api/products", userProductRoute);

router.use("/api/admin", adminCartRoute);
router.use("/api/admin", adminProductRoute);
router.use("/api/admin", adminOrderRoute);
router.use("/api/admin", adminUserRoute);

export { router as router };
