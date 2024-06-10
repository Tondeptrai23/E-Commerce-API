import { appendToObject, isEmptyObject } from "../utils/utils.js";
import { Op } from "sequelize";

export default class SequelizeQueryBuilder {
    /**
     *
     * @summary Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @param {Object} requestQuery Request.query
     * @returns {Array} Array of conditions.
     * Format: [{equalField: [value1, value2]}, {compareField: {operator1: value1, operator2: value2}}, ...]
     *
     */
    convertFilterCondition = (requestQuery) => {
        if (!requestQuery) return [];
        const excludedFields = ["sort", "page", "size"];

        const conditions = [];
        const comparisonConditions = {};
        const map = [
            { comparator: "[lte]", operator: Op.lte },
            { comparator: "[gte]", operator: Op.gte },
            { comparator: "[between]", operator: Op.between },
        ];

        const fields = Object.keys(requestQuery).filter((field) => {
            return !excludedFields.includes(field);
        });
        fields.forEach((field) => {
            if (!requestQuery[field]) return;

            let values;
            if (Array.isArray(requestQuery[field])) {
                values = [...requestQuery[field]];
            } else values = [requestQuery[field]];

            const equalityValues = [];
            values.forEach((value) => {
                // Handle integer values
                if (typeof value === "number") {
                    value = value.toString();
                }

                // Equal case
                if (!value.includes("[")) {
                    equalityValues.push(value);
                    return;
                }

                // Comparison case
                map.forEach(({ comparator, operator }) => {
                    if (!value.startsWith(comparator)) {
                        return;
                    }

                    let compareValue = value.substring(comparator.length);
                    if (operator === Op.between)
                        compareValue = compareValue.split(",");
                    comparisonConditions[field] = appendToObject(
                        comparisonConditions[field],
                        {
                            [operator]: compareValue,
                        }
                    );
                });
            });

            if (equalityValues.length > 0) {
                conditions.push({ [field]: equalityValues });
            }
        });

        if (!isEmptyObject(comparisonConditions))
            conditions.push(comparisonConditions);

        return conditions;
    };

    /**
     *
     * @summary Get order condtions from a request query to retrieve a sorted data
     * from a Sequelize magic method.
     *
     * @param {Array<String>} requestQuery The query from the request. Ex: ["price,DESC", "name,ASC"]
     * @returns An array of order condtions which is compatible for Sequelize sorting.
     * Ex: [["price", "DESC"], ["name", "ASC"]]
     *
     */
    convertSortCondition = (requestQuery) => {
        const sortConditions = [];
        if (!requestQuery || !requestQuery.sort) return sortConditions;
        let query;
        if (!Array.isArray(requestQuery.sort)) {
            query = [requestQuery.sort];
        } else {
            query = [...requestQuery.sort];
        }

        query.forEach((sortString) => {
            const [field, orderBy] = sortString.split(",");

            sortConditions.push([field, orderBy]);
        });

        return sortConditions;
    };

    /**
     * @summary Get the limit and offset values from the request query
     *
     * @param {Object} requestQuery The query from the request
     * @returns {Object} An object contains the limit and offset values
     */
    convertPaginationCondition = (requestQuery) => {
        const { page, size, ...rest } = requestQuery;

        const limit = size === undefined ? 20 : parseInt(size);
        const offset = page === undefined ? 0 : (parseInt(page) - 1) * limit;

        return { limit, offset };
    };
}
