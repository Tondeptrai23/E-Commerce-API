import Variant from "../../models/products/variant.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import VariantSortBuilder from "../condition/sort/variantSortBuilder.service.js";
import VariantFilterBuilder from "../condition/filter/variantFilterBuilder.service.js";
import { Op } from "sequelize";
import ProductImage from "../../models/products/productImage.model.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";

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
        if (
            variant instanceof Variant === false ||
            !attributes ||
            Object.keys(attributes).length === 0
        ) {
            return variant;
        }

        // Find existing attributes for the variant
        const detailedVariant = await Variant.findByPk(variant.variantID, {
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
                    attributes: ["attributeID", "name"],
                },
            },
        });
        const existingAttributes = detailedVariant.attributeValues.map(
            ({ attribute }) => attribute.name
        );

        // Filter attributes that need to be added
        const attributesToAdd = Object.entries(attributes).filter(
            ([name]) => !existingAttributes.includes(name)
        );

        // Bulk fetch AttributeValues that need to be added
        const attributeValuesToCreate = await Promise.all(
            attributesToAdd.map(async ([name, value]) => {
                return await AttributeValue.findOne({
                    where: { value },
                    include: {
                        model: Attribute,
                        as: "attribute",
                        attributes: ["name"],
                        where: { name },
                    },
                });
            })
        );

        // Filter out any null results (attribute values that were not found)
        const validAttributeValues = attributeValuesToCreate.filter(Boolean);

        // Bulk create VariantAttributeValue records
        if (validAttributeValues.length > 0) {
            await VariantAttributeValue.bulkCreate(
                validAttributeValues.map(({ valueID }) => ({
                    variantID: variant.variantID,
                    valueID,
                }))
            );

            // Append new attribute values to the detailed variant
            detailedVariant.attributeValues.push(...validAttributeValues);
        }
        return detailedVariant;
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
            include: [
                {
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
                {
                    model: ProductImage,
                    as: "image",
                },
            ],
            order: [...conditions.sortConditions],
            paranoid: false,
        });
    }
}

export default new VariantAttributeService();
