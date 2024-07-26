import QueryToSequelizeConditionConverter from "./sequelizeConverter.service.js";
import { appendToObject, isEmptyObject } from "../../utils/utils.js";
import attributeService from "../products/attribute.service.js";

export default class AttributeFilterBuilder extends QueryToSequelizeConditionConverter {
    #allowFields = [];
    constructor(requestQuery, allowFields) {
        super(requestQuery);
        this.#allowFields = allowFields;
    }

    /**
     * Create a new instance of AttributeFilterBuilder
     *
     * @param {Object} requestQuery the query object to convert
     * @returns {AttributeFilterBuilder} the instance of AttributeFilterBuilder
     */
    static create = async (requestQuery) => {
        const allowFields = (await attributeService.getAttributes()).map(
            (attribute) => attribute.name
        );

        return new AttributeFilterBuilder(requestQuery, allowFields);
    };

    /**
     * Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @returns {Array} Array of conditions
     * Format: [{"attribute.name": [value1, value2]}, ...]
     */
    build = () => {
        if (!this._query) return [];

        const conditions = [];

        const fields = Object.keys(this._query).filter((field) =>
            this.#allowFields.includes(field)
        );

        fields.forEach((field) => {
            if (!this._query[field]) return;

            // Flatten field
            let value;
            if (Array.isArray(this._query[field])) {
                value = this._query[field].map((v) => v.split(",")).flat();
            } else {
                value = this._query[field].split(",");
            }

            conditions.push({ name: field, value: value });
        });

        return conditions;
    };
}
