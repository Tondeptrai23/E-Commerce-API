import { Router } from "express";

import paymentController from "../../../controllers/shopping/payments.controller.js";

const paymentRoute = Router();

paymentRoute.post(
    "/momo/notify",
    paymentController.notifyMoMo.bind(paymentController)
);

paymentRoute.post(
    "/stripe/notify",
    paymentController.notifyStripe.bind(paymentController)
);

export default paymentRoute;
