import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve coupons
 *
 * @example
 * const sortConditions = new CouponSortBuilder(query).build();
 */
export default class CouponSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            code: ["code"],
            discountType: ["discountType"],
            discountValue: ["discountValue"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
            startDate: ["startDate"],
            endDate: ["endDate"],
            timesUsed: ["timesUsed"],
            maxUsage: ["maxUsage"],
            minimumOrderAmount: ["minimumOrderAmount"],
        };
        this._defaultSort = [["createdAt", "ASC"]];
    }
}
