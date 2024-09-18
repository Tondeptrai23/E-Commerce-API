import { paymentConfig } from "../../config/config.js";
import IPayment from "./iPayment.service.js";
import Stripe from "stripe";

const stripe = new Stripe(paymentConfig.stripe.SECRET_KEY);

export default class StripePayment extends IPayment {
    constructor(order) {
        super(order);
    }

    /**
     * Get payment url from Stripe API
     *
     * @returns {String} Payment url
     */
    async createPaymentUrl() {
        const items = this._order.products.map((product) => {
            return {
                price_data: {
                    currency: paymentConfig.stripe.CURRENCY,
                    product_data: {
                        name: product.name,
                    },
                    unit_amount:
                        product.orderItem.discountPriceAtPurchase ??
                        product.orderItem.priceAtPurchase,
                },
                quantity: product.orderItem.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items: items,
            mode: "payment",
            success_url: `${paymentConfig.stripe.REDIRECT_URL_SUCCESS}`,
            cancel_url: `${paymentConfig.stripe.REDIRECT_URL_FAILED}`,
            expires_at:
                Math.floor(Date.now() / 1000) +
                paymentConfig.stripe.EXPIRED_TIME,
            payment_intent_data: {
                metadata: {
                    orderID: this._order.orderID,
                },
            },
        });

        return {
            paymentUrl: session.url,
            orderID: this._order.orderID,
            amount: this._order.finalTotal,
        };
    }

    static async getOrderIDFromPaymentIntent(paymentIntentID) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentID
        );

        return paymentIntent.metadata.orderID;
    }
}
