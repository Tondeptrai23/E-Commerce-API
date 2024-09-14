import { Router } from "express";

import paymentController from "../../controllers/shopping/payments.controller.js";

const paymentRoute = Router();

paymentRoute.post("/momo/notify", paymentController.notifyMoMo);

export default paymentRoute;
