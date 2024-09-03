import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve products.
 */
export default class OrderFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "orderID",
            "userID",
            "couponID",
            "shippingAddressID",
            "status",
            "paymentMethod",
            "subTotal",
            "finalTotal",
            "createdAt",
            "updatedAt",
            "deletedAt",
        ];
    }
}
