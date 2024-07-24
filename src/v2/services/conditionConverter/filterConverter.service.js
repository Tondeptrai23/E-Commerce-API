import QueryToSequelizeConditionConverter from "./sequelizeConverter.service.js";
import { appendToObject, isEmptyObject } from "../../utils/utils.js";
import attributeService from "../products/attribute.service.js";
import { Op } from "sequelize";

export default class QueryToFilterConditionConverter extends QueryToSequelizeConditionConverter {
    #allowFields = [];
    #comparisonOperators = {};

    constructor(requestQuery, allowFields) {
        super(requestQuery);
        this.#allowFields = allowFields;
        this.#comparisonOperators = {
            "[lte]": Op.lte,
            "[gte]": Op.gte,
            "[between]": Op.between,
        };
    }

    /**
     * Create a new instance of FilterQueryBuilder
     *
     * @param {Object} requestQuery - The query object from the request
     * @param {string} className - The name of the class
     */
    static create = async (requestQuery, className) => {
        const fieldMappings = {
            product: ["name", "description"],
            category: ["name", "description"],
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
            variantAttribute: (await attributeService.getAttributes()).map(
                (attribute) => attribute.name
            ),
        };

        return new QueryToFilterConditionConverter(
            requestQuery,
            fieldMappings[className]
        );
    };

    /**
     * Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @returns {Array} Array of conditions
     * Format: [{equalField: [value1, value2]}, {compareField: {operator1: value1, operator2: value2}}, ...]
     */
    convert = () => {
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
