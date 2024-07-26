import QueryToSequelizeConditionConverter from "./sequelizeConverter.service.js";
import { appendToObject, isEmptyObject } from "../../utils/utils.js";
import { Op } from "sequelize";

export default class FilterBuilder extends QueryToSequelizeConditionConverter {
    #allowFields = [];
    #comparisonOperators = {};

    constructor(requestQuery, modelName) {
        super(requestQuery);

        const fieldMappings = {
            product: ["name"],
            category: ["name"],
            user: ["name", "email"],
            variant: ["stock", "price", "discountPrice", "sku", "imageOrder"],
            order: [
                "status",
                "orderDate",
                "message",
                "subTotal",
                "finalTotal",
                "paymentMethod",
            ],
            coupon: [
                "code",
                "discountType",
                "discountValue",
                "target",
                "minimumOrderAmount",
                "timesUsed",
                "maxUsage",
                "startDate",
                "endDate",
            ],
        };

        this.#allowFields = fieldMappings[modelName];
        this.#comparisonOperators = {
            "[lte]": Op.lte,
            "[gte]": Op.gte,
            "[between]": Op.between,
            "[like]": Op.like,
        };
    }

    /**
     * Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @returns {Array} Array of conditions
     * Format: [{equalField: [value1, value2]}, {compareField: {operator1: value1, operator2: value2}}, ...]
     */
    build = () => {
        if (!this._query) return [];

        const conditions = [];
        const comparisonConditions = {};

        const fields = Object.keys(this._query).filter((field) =>
            this.#allowFields.includes(field)
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

                Object.entries(this.#comparisonOperators).forEach(
                    ([comparator, operator]) => {
                        if (!value.startsWith(comparator)) return;

                        let compareValue = value.substring(comparator.length);
                        if (operator === Op.between) {
                            compareValue = compareValue.split(",");
                        }

                        if (operator === Op.like) {
                            compareValue = `%${compareValue}%`;
                        }

                        comparisonConditions[field] = appendToObject(
                            comparisonConditions[field],
                            {
                                [operator]: compareValue,
                            }
                        );
                    }
                );
            });

            if (equalityValues.length > 0) {
                conditions.push({ [field]: equalityValues });
            }
        });

        if (!isEmptyObject(comparisonConditions)) {
            conditions.push(comparisonConditions);
        }

        return conditions;
    };
}