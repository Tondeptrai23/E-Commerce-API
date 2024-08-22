import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve variants.
 */
export default class VariantFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "variantID",
            "name",
            "price",
            "discountPrice",
            "stock",
            "sku",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "productID",
        ];
    }
}
