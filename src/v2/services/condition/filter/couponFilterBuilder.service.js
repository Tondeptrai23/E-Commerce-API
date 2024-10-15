import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve coupons.
 */
export default class CouponFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "couponID",
            "code",
            "discountType",
            "discountValue",
            "target",
            "minimumOrderAmount",
            "maximumDiscountAmount",
            "timesUsed",
            "maxUsage",
            "startDate",
            "endDate",
            "createdAt",
            "updatedAt",
        ];
    }
}
