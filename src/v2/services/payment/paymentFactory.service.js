import Order from "../../models/shopping/order.model.js";
import { ConflictError } from "../../utils/error.js";
import IPayment from "./iPayment.service.js";
import MomoPayment from "./momoPayment.service.js";
import StripePayment from "./stripePayment.service.js";
import { paymentConfig } from "../../config/config.js";

export default class PaymentFactory {
    /**
     *
     * @param {String} paymentType
     * @param {Order} order
     * @returns {IPayment} Payment object
     */
    static createPayment(paymentType, order) {
        switch (paymentType) {
            case "Momo":
                if (paymentConfig.momo.ACTIVE === false) {
                    break;
                }

                return new MomoPayment(order);
            case "CreditCard":
                if (paymentConfig.stripe.ACTIVE === false) {
                    break;
                }

                return new StripePayment(order);
            default:
                break;
        }

        throw new ConflictError("Payment method is not supported");
    }
}
