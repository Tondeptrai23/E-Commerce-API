import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve categories.
 */
export default class CategoryFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "categoryID",
            "name",
            "parentID",
            "createdAt",
            "updatedAt",
        ];
    }
}
