import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve products
 *
 * @example
 * const sortConditions = new ProductSortBuilder(query).build();
 */
export default class ProductSortBuilder extends SortBuilder {
    #mapping;
    constructor(requestQuery) {
        super(requestQuery);
        this.#mapping = {
            name: ["name"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],

            price: ["variants", "price"],
            discountPrice: ["variants", "discountPrice"],
            stock: ["variants", "stock"],
        };
    }

    /**
     * @summary Get the mapping of the field names in the request query to the field names in the database
     *
     * @protected
     * @param {string} name the name of the field in the request query
     * @returns {Object} the mapping of the field names in the request query to the field names in the database
     *
     */
    _mapping(name) {
        return this.#mapping[name];
    }
}
