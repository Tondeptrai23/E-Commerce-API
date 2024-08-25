import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve attributes values.
 *
 * @example
 * const attributeValueFilter = new AttributeValueFilterBuilder(query).build();
 */
export default class AttributeValueFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "attributeID",
            "valueID",
            "value",
            "createdAt",
            "updatedAt",
        ];
    }
}
