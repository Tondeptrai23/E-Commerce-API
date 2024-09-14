import { default as axios } from "axios";
import { createHmac } from "crypto";
import Order from "../../models/shopping/order.model.js";
import { paymentConfig } from "../../config/config.js";
import { PaymentInvalidError } from "../../utils/error.js";

export default class MomoPayment {
    constructor() {}

    static #signSignature(data) {
        const rawSignature = Object.keys(data)
            .sort()
            .map((key) => key + "=" + data[key])
            .join("&");

        return createHmac("sha256", paymentConfig.momo.SECRET_KEY)
            .update(rawSignature)
            .digest("hex");
    }

    /**
     * Get payment url from MoMo API
     *
     * @param {Order} order Order object
     * @returns {Promise<String>} Payment url
     */
    static async getPaymentInfo(order) {
        const dataToSigned = {
            partnerCode: paymentConfig.momo.PARTNER_CODE,
            accessKey: paymentConfig.momo.ACCESS_KEY,
            requestId: order.orderID,
            amount: order.finalTotal,
            orderId: order.orderID,
            orderInfo: paymentConfig.momo.ORDER_INFO,
            requestType: paymentConfig.momo.REQUEST_TYPE,
            redirectUrl: paymentConfig.momo.REDIRECT_URL,
            ipnUrl: paymentConfig.momo.NOTIFY_URL,
            extraData: "",
        };

        const requestBody = {
            ...dataToSigned,
            lang: paymentConfig.momo.LANGUAGE,
            signature: this.#signSignature(dataToSigned),
        };

        const response = await axios.post(
            `${paymentConfig.momo.PAYMENT_URL}/v2/gateway/api/create`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(
                        JSON.stringify(requestBody)
                    ),
                },
            }
        );

        if (response.data.errorCode !== 0) {
            throw new PaymentInvalidError("Payment failed! Cancel order!");
        }

        return {
            paymentUrl: response.data.payUrl,
            orderID: response.data.orderId,
            amount: response.data.amount,
        };
    }

    /**
     * Get payment status from MoMo API
     */
    static async getPaymentStatus(order) {
        const data = {
            partnerCode: paymentConfig.momo.PARTNER_CODE,
            accessKey: paymentConfig.momo.ACCESS_KEY,
            requestId: order.orderID,
            orderId: order.orderID,
        };

        const requestBody = {
            ...data,
            lang: paymentConfig.momo.LANGUAGE,
            signature: this.#signSignature(data),
        };

        const response = await axios.post(
            `${paymentConfig.momo.PAYMENT_URL}/v2/gateway/api/query`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(
                        JSON.stringify(requestBody)
                    ),
                },
            }
        );

        return response.data;
    }
}
