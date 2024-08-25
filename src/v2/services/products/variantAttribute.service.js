import Variant from "../../models/products/variant.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import VariantSortBuilder from "../condition/sort/variantSortBuilder.service.js";
import VariantFilterBuilder from "../condition/filter/variantFilterBuilder.service.js";
import { Op } from "sequelize";

class VariantAttributeService {
    /**
     * Get variants that have the attribute
     *
     * @param {String} attributeID the attribute's ID
     * @param {Object} query the query object for filtering, sorting and pagination
     * @returns {Promise<Variant[]>} the list of variants
     */
    async getVariantsByAttribute(attributeID, query) {
        const conditions = this.#buildConditions(query);

        const { count, variantIDs } = await this.#getSatisfiedVariantIDs(
            conditions,
            attributeID
        );

        const variants = await this.#fetchVariants(conditions, variantIDs);

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            variants: variants,
        };
    }

    /**
     * Get variants that have the attribute value
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID
     * @param {Object} query the query object for filtering, sorting and pagination
     * @returns {Promise<Variant[]>} the list of variants
     */
    async getVariantsByAttributeValue(attributeID, valueID, query) {
        const conditions = this.#buildConditions(query);

        const { count, variantIDs } = await this.#getSatisfiedVariantIDs(
            conditions,
            attributeID,
            valueID
        );

        const variants = await this.#fetchVariants(conditions, variantIDs);

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            variants: variants,
        };
    }

    /**
     * Add attributes for variant
     *
     * @param {Variant} variant the variant to be added attributes
     * @param {Object[]} attributes the attributes to be added
     * @returns {Promise<Variant>} the variant with the added attributes
     */
    async addAttributesForVariant(variant, attributes) {
        if (variant instanceof Variant === false) {
            return variant;
        }

        if (!attributes || Object.keys(attributes).length === 0) {
            return variant;
        }

        const variantAttributes = (
            await Promise.all(
                Object.entries(attributes).map(async ([name, value]) => {
                    const attributeValue = await AttributeValue.findOne({
                        where: {
                            value: value,
                        },
                        include: {
                            model: Attribute,
                            as: "attribute",
                            attributes: ["name"],
                            where: {
                                name: name,
                            },
                        },
                    });

                    if (!attributeValue) {
                        return null;
                    }
                    await variant.addAttributeValue(attributeValue);

                    return attributeValue;
                })
            )
        ).filter((attribute) => attribute !== null);

        variant.attributeValues = variantAttributes;
        return variant;
    }

    /**
     *
     * The following methods are used in getVariantsByAttribute and getVariantsByAttributeValue
     *
     */

    /**
     *
     */
    #buildConditions(query) {
        const paginationConditions = new PaginationBuilder(query).build();
        const sortConditions = new VariantSortBuilder(query).build();
        const variantFilter = new VariantFilterBuilder(query).build();

        return {
            paginationConditions,
            sortConditions,
            variantFilter,
        };
    }

    /**
     * Get variant IDs that satisfy the conditions
     *
     * @param {Object} conditions the conditions for filtering, sorting and pagination
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID (optional)
     * @returns {Promise<{ count: Number, variantIDs: String[] }>} the count of variants and the variant IDs
     */
    async #getSatisfiedVariantIDs(conditions, attributeID, valueID = null) {
        let { count, rows: variantIDs } = await Variant.findAndCountAll({
            attributes: ["variantID"],
            include: {
                model: AttributeValue,
                as: "attributeValues",
                attributes: [],
                through: {
                    attributes: [],
                },
                include: {
                    model: Attribute,
                    as: "attribute",
                    attributes: [],
                },
                where: {
                    attributeID: attributeID,
                    valueID: valueID ? valueID : { [Op.ne]: null },
                },
            },
            where: [...conditions.variantFilter],
            ...conditions.paginationConditions,
            order: [...conditions.sortConditions],
            group: ["variantID"],

            subQuery: false,
            distinct: true,
            raw: true,
            paranoid: false,
        });

        return {
            count: count.reduce((acc, row) => acc + row.count, 0),
            variantIDs: variantIDs.map((row) => row.variantID),
        };
    }

    /**
     * Fetch variants by variantIDs
     *
     * @param {Object} conditions the conditions for filtering, sorting and pagination
     * @param {String[]} variantIDs the variant IDs
     * @returns {Promise<Variant[]>} the list of variants
     */
    async #fetchVariants(conditions, variantIDs) {
        return await Variant.findAll({
            where: {
                variantID: variantIDs,
            },
            include: {
                model: AttributeValue,
                as: "attributeValues",
                attributes: ["value"],
                through: {
                    attributes: [],
                },
                include: {
                    model: Attribute,
                    as: "attribute",
                    attributes: ["name"],
                },
            },
            order: [...conditions.sortConditions],
            paranoid: false,
        });
    }
}

export default new VariantAttributeService();
