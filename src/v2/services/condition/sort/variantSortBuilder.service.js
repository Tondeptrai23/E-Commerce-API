import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve variants
 *
 * @example
 * const sortConditions = new VariantSortBuilder(query).build();
 */
export default class VariantSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            productID: ["productID"],
            variantID: ["variantID"],
            price: ["price"],
            discountPrice: ["discountPrice"],
            stock: ["stock"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
            deletedAt: ["deletedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
