import orderService from "../../services/shopping/order.service.js";
import { StatusCodes } from "http-status-codes";
import { paymentConfig } from "../../config/config.js";

class PaymentController {
    constructor() {}

    async notifyMoMo(req, res) {
        try {
            if (req.body.partnerCode !== paymentConfig.momo.PARTNER_CODE) {
                res.status(StatusCodes.BAD_REQUEST).send(
                    "Invalid partner code"
                );
                return;
            }

            const orderID = req.body.orderId;
            if (req.body.resultCodes == 0) {
                await orderService.updateOrderStatus(orderID, "processing");
            } else {
                await orderService.handleFailedPayment(orderID);
            }
        } catch (err) {
            console.log(err);
        }

        res.status(StatusCodes.NO_CONTENT).send();
    }
}

export default new PaymentController();
