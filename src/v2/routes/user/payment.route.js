import { Router } from "express";

import paymentController from "../../controllers/shopping/payments.controller.js";

const paymentRoute = Router();

paymentRoute.post("/momo/notify", paymentController.notifyMoMo);

paymentRoute.post("/stripe/notify", paymentController.notifyStripe);

export default paymentRoute;
