import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve products
 *
 * @example
 * const sortConditions = new ProductSortBuilder(query).build();
 */
export default class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            name: ["name"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],

            price: ["variants", "price"],
            discountPrice: ["variants", "discountPrice"],
            stock: ["variants", "stock"],
        };
    }
}
