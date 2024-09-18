export default class IPayment {
    constructor(order) {
        this._order = order;
    }

    /**
     * Create payment url
     */
    async createPaymentUrl() {
        throw new Error("Method 'createPaymentUrl()' must be implemented");
    }
}
