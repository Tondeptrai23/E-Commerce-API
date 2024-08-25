import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve categories
 *
 * @example
 * const sortConditions = new AttributeValueSortBuilder(query).build();
 */
export default class AttributeValueSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            valueID: ["valueID"],
            attributeID: ["attributeID"],
            value: ["value"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
