import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve orders
 *
 * @example
 * const sortConditions = new OrderSortBuilder(query).build();
 */
export default class OrderSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            orderID: ["orderID"],
            status: ["status"],
            subTotal: ["subTotal"],
            finalTotal: ["finalTotal"],
            paymentMethod: ["paymentMethod"],
            userID: ["userID"],
            couponID: ["couponID"],
            shippingAddressID: ["shippingAddressID"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
            deletedAt: ["deletedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
