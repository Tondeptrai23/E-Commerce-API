import Order from "../../models/shopping/order.model.js";
import { ConflictError } from "../../utils/error.js";
import IPayment from "./iPayment.service.js";
import MomoPayment from "./momoPayment.service.js";
import StripePayment from "./stripePayment.service.js";

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
                return new MomoPayment(order);
            case "CreditCard":
                return new StripePayment(order);
            default:
                throw new ConflictError("Invalid payment type!");
        }
    }
}
