import orderService from "../../services/shopping/order.service.js";
import userService from "../../services/users/user.service.js";
import MailService from "../../services/users/mail.service.js";
import { StatusCodes } from "http-status-codes";
import { paymentConfig } from "../../config/config.js";
import StripePayment from "../../services/payment/stripePayment.service.js";

class PaymentController {
    constructor() {}

    async getPaymentMethods(req, res, next) {
        try {
            const validPayments = ["Cod"];

            if (paymentConfig.momo.ACTIVE) {
                validPayments.push("Momo");
            }
            if (paymentConfig.stripe.ACTIVE) {
                validPayments.push("CreditCard");
            }

            res.status(StatusCodes.OK).json({
                success: true,
                paymentMethods: validPayments,
            });
        } catch (err) {
            next(err);
        }
    }

    async notifyMoMo(req, res, next) {
        try {
            if (req.body.partnerCode !== paymentConfig.momo.PARTNER_CODE) {
                res.status(StatusCodes.BAD_REQUEST).send(
                    "Invalid partner code"
                );
                return;
            }

            const orderID = req.body.orderId;
            const isSuccess = req.body.resultCode == 0;

            await this.#processPaymentResult(orderID, isSuccess);
        } catch (err) {
            console.log(err);
        }

        res.status(StatusCodes.NO_CONTENT).send();
    }

    async notifyStripe(req, res, next) {
        try {
            const event = req.body;
            const orderID = await StripePayment.getOrderIDFromPaymentIntent(
                event.data.object.payment_intent
            );

            const isSuccess = event.type === "charge.succeeded";
            await this.#processPaymentResult(orderID, isSuccess);
        } catch (err) {
            console.log(err);
        }

        res.status(StatusCodes.OK).send({
            recieved: true,
        });
    }

    async #processPaymentResult(orderID, isSuccess) {
        let updatedOrder;

        if (isSuccess) {
            updatedOrder = await orderService.updateOrderStatus(
                orderID,
                "processing"
            );
        } else {
            updatedOrder = await orderService.handleFailedPayment(orderID);
        }

        const user = await userService.getUser(updatedOrder.userID);

        await this.#sendEmail(user.email, updatedOrder, isSuccess);
    }

    async #sendEmail(email, order, isSuccess) {
        if (isSuccess) {
            await MailService.sendOrderConfirmationEmail(email, order);
        } else {
            await MailService.sendOrderFailedEmail(email, order);
        }
    }
}

export default new PaymentController();
