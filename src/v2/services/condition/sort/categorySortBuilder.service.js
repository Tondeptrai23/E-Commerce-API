import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve categories
 *
 * @example
 * const sortConditions = new CategorySortBuilder(query).build();
 */
export default class CategorySortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            categoryID: ["categoryID"],
            parentID: ["parentID"],
            name: ["name"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
