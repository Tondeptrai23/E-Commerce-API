import { default as axios } from "axios";
import { createHmac } from "crypto";
import { paymentConfig } from "../../config/config.js";
import IPayment from "./iPayment.service.js";

export default class MomoPayment extends IPayment {
    constructor(order) {
        super(order);
    }

    #signSignature(data) {
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
     * @returns {Promise<String>} Payment url
     */
    async createPaymentUrl() {
        const dataToSigned = {
            partnerCode: paymentConfig.momo.PARTNER_CODE,
            accessKey: paymentConfig.momo.ACCESS_KEY,
            requestId: this._order.orderID,
            amount: this._order.finalTotal,
            orderId: this._order.orderID,
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

        if (response.data.resultCode !== 0) {
            throw new Error(
                "Error when create payment url with momo! Please try again later or use another payment method."
            );
        }

        return {
            paymentUrl: response.data.payUrl,
            orderID: response.data.orderId,
            amount: response.data.amount,
        };
    }
}
