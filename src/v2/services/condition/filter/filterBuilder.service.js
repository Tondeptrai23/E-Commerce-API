import QueryToSequelizeConditionConverter from "../sequelizeConverter.service.js";
import { Op } from "sequelize";

/**
 * @summary A class to build filtering conditions from a request query
 * to retrieve resources
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve resources from a Sequelize magic method.
 *
 * This class is meant to be extended by other classes to build filtering
 * conditions for specific resources.
 *
 */
export default class FilterBuilder extends QueryToSequelizeConditionConverter {
    _allowFields = [];
    _comparisonOperators = {};

    constructor(requestQuery) {
        super(requestQuery);

        this._allowFields = requestQuery ? Object.keys(requestQuery) : [];
        this._comparisonOperators = {
            "[lte]": Op.lte,
            "[gte]": Op.gte,
            "[between]": Op.between,
            "[like]": Op.like,
            "[ne]": Op.ne,
            "[lt]": Op.lt,
            "[gt]": Op.gt,
        };
    }

    /**
     * Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @returns {Array} Array of conditions
     * Format: [{field1: [value1, value2]}, {field1: {operator1: value1}}, {field1: {operator2: value2}}, ...]
     */
    build = () => {
        if (!this._query) return [];

        const conditions = [];

        const fields = Object.keys(this._query).filter((field) =>
            this._allowFields.includes(field)
        );

        fields.forEach((field) => {
            if (!this._query[field]) return;

            let values = Array.isArray(this._query[field])
                ? [...this._query[field]]
                : [this._query[field]];

            const equalityValues = [];
            values.forEach((value) => {
                if (typeof value === "number") {
                    value = value.toString();
                }

                if (!value.includes("[")) {
                    equalityValues.push(value);
                    return;
                }

                Object.entries(this._comparisonOperators).forEach(
                    ([comparator, operator]) => {
                        if (!value.startsWith(comparator)) return;

                        let compareValue = value.substring(comparator.length);
                        if (operator === Op.between) {
                            compareValue = compareValue.split(",");
                        }

                        if (operator === Op.like) {
                            compareValue = `%${compareValue}%`;
                        }

                        conditions.push({
                            [field]: { [operator]: compareValue },
                        });
                    }
                );
            });

            if (equalityValues.length > 0) {
                conditions.push({ [field]: equalityValues });
            }
        });

        return conditions;
    };
}
