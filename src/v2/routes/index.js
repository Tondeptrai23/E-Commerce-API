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

router.use("/auth", authRoute);

router.use("/cart", userCartRoute);
router.use("/orders", userOrderRoute);
router.use("/products", userProductRoute);

router.use("/admin", adminCartRoute);
router.use("/admin", adminProductRoute);
router.use("/admin", adminOrderRoute);
router.use("/admin", adminUserRoute);

export { router as router };
