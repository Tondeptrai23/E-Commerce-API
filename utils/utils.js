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
 * @param {Model} modelClass Model class (e.g. Product)
 * @returns {Array} Array of conditions.
 * Format: [{equalField: [value1, value2]}, {compareField: {operator1: value1, operator2: value2}}, ...]
 */
const convertQueryToSequelizeCondition = (requestQuery, modelClass) => {
    const conditions = [];
    const comparisonConditions = {};
    const map = [
        { comparator: "[lte]", operator: Op.lte },
        { comparator: "[gte]", operator: Op.gte },
        { comparator: "[between]", operator: Op.between },
    ];

    const fields = Object.keys(modelClass.getAttributes());
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

export { isEmptyObject, convertQueryToSequelizeCondition };
