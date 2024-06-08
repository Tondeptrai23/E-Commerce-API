import { Op } from "sequelize";

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const appendToObject = (obj, newObject) => {
    if (!obj) {
        obj = newObject;
    } else {
        Object.assign(obj, newObject);
    }
    return obj;
};

// TODO: This function will be moved when the project get bigger
/**
 *
 * @summary Convert Request.query to Sequelize-compatible condition object for querying the database
 *
 * @param {String} requestQuery Request.query
 * @returns {Array} Array of conditions.
 * Format: [{equalField: [value1, value2]}, {compareField: {operator1: value1, operator2: value2}}, ...]
 */
const convertQueryToSequelizeCondition = (requestQuery) => {
    if (!requestQuery) return [];
    const excludedFields = ["sort", "limit", "offset"];

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
 * @summary Get order condtions from a request query to retrieve a sorted data
 * from a Sequelize magic method.
 *
 * @param {Array<String>} requestQuery The query from the request. Ex: ["price,DESC", "name,ASC"]
 * @param {Class} modelClass The class need to sort data. Ex: Product, User
 * @returns An array of order condtions which is compatible for Sequelize sorting.
 * Ex: [["price", "DESC"], ["name", "ASC"]]
 */
const getSortCondtionsFromQuery = (requestQuery) => {
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

export {
    isEmptyObject,
    convertQueryToSequelizeCondition,
    getSortCondtionsFromQuery,
};
