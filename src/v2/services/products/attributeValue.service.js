import Attribute from "../../models/products/attribute.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import FilterBuilder from "../condition/filter/filterBuilder.service.js";
import AttributeValueFilterBuilder from "../condition/filter/attributeValueFilterBuilder.service.js";
import AttributeValueSortBuilder from "../condition/sort/attributeValueSortBuilder.service.js";
import { db } from "../../models/index.model.js";

class AttributeValueService {
    /**
     * Get attribute values
     *
     * @param {Object} query the query object
     * @returns {Promise<Object>} the attribute values, total items, total pages, and current page
     */
    async getAttributeValues(query) {
        const conditions = this.#buildConditions(query);

        const { count, valueIDs } = await this.#getSatisfiedAttributeValues(
            conditions
        );

        const attributeValues = await this.#fetchAttributeValues(
            conditions,
            valueIDs
        );

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            values: attributeValues,
        };
    }

    /**
     * Check if attribute value is taken
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} value the attribute value
     * @returns {Promise<Boolean>} true if the value is taken, false otherwise
     */
    async isAttributeValueTaken(attributeID, value) {
        const attributeValue = await AttributeValue.findOne({
            where: {
                attributeID: attributeID,
                value: value,
            },
        });

        return attributeValue ? true : false;
    }

    /**
     * Add attribute value
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} value the attribute value
     * @returns {Promise<AttributeValue>} the created attribute value
     */
    async addAttributeValue(attributeID, value) {
        const attribute = await Attribute.findByPk(attributeID);
        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        // Check if value is taken
        const isValueTaken = await this.isAttributeValueTaken(
            attributeID,
            value
        );
        if (isValueTaken) {
            throw new ConflictError("Attribute value is taken");
        }

        const attributeValue = await AttributeValue.create({
            value: value,
            attributeID: attributeID,
        });

        return attributeValue;
    }

    /**
     * Get attribute value of an attribute
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID
     * @returns {Promise<AttributeValue>} the attribute value
     * @throws {ResourceNotFoundError} if the attribute or attribute value is not found
     */
    async getAttributeValue(attributeID, valueID) {
        const attribute = await Attribute.findByPk(attributeID, {
            include: {
                model: AttributeValue,
                as: "values",
                required: false,
                where: {
                    valueID: valueID,
                },
            },
        });

        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        if (attribute.values.length === 0) {
            throw new ResourceNotFoundError("Attribute value not found");
        }

        return attribute.values[0];
    }

    /**
     * Rename attribute value
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID
     * @param {String} value the new value
     * @returns {Promise<AttributeValue>} the renamed attribute value
     * @throws {ConflictError} if the attribute value is taken
     * @throws {ResourceNotFoundError} if the attribute value is not found
     */
    async renameAttributeValue(attributeID, valueID, value) {
        const attributeValue = await this.getAttributeValue(
            attributeID,
            valueID
        );

        // Check if value is the same
        if (attributeValue.value === value) {
            return attributeValue;
        }

        // Check if value is taken
        const isValueTaken = await this.isAttributeValueTaken(
            attributeValue.attributeID,
            value
        );
        if (isValueTaken) {
            throw new ConflictError("Attribute value is taken");
        }

        attributeValue.value = value;
        await attributeValue.save();

        return attributeValue;
    }

    /**
     * Replace attribute value
     * Remove all asscoiations between variant and attribute value
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID
     * @param {String} value the new value
     * @returns {Promise<AttributeValue>} the replaced attribute value
     * @throws {ConflictError} if the attribute value is taken
     * @throws {ResourceNotFoundError} if the attribute value is not found
     */
    async replaceAttributeValue(attributeID, valueID, value) {
        const attributeValue = await this.getAttributeValue(
            attributeID,
            valueID
        );
        return await db
            .transaction(async (t) => {
                // Delete variant attribute value
                await VariantAttributeValue.destroy({
                    where: {
                        valueID: valueID,
                    },
                });

                // Rename
                if (attributeValue.value !== value) {
                    const isValueTaken = await this.isAttributeValueTaken(
                        attributeValue.attributeID,
                        value
                    );
                    if (isValueTaken) {
                        throw new ConflictError("Attribute value is taken");
                    }
                    attributeValue.value = value;
                    await attributeValue.save();
                }

                return attributeValue;
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Delete attribute value
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} valueID the attribute value's ID
     * @throws {ResourceNotFoundError} if the attribute value is not found
     */
    async deleteAttributeValue(attributeID, valueID) {
        const attributeValue = await this.getAttributeValue(
            attributeID,
            valueID
        );

        await attributeValue.destroy();
    }

    /**
     *
     * The following methods are used in getAttributeValues method
     *
     */

    /**
     * Build conditions (used in getAttributeValues method)
     *
     * @param {Object} query the query object
     * @returns {Object} the conditions object
     */
    #buildConditions(query) {
        const paginationConditions = new PaginationBuilder(query).build();
        const sortConditions = new AttributeValueSortBuilder(query).build();
        const attributeValueFilter = new AttributeValueFilterBuilder(
            query
        ).build();
        const attributeFilter = new FilterBuilder({
            name: query ? query.attributeName : undefined,
        }).build();

        return {
            paginationConditions,
            sortConditions,
            attributeValueFilter,
            attributeFilter,
        };
    }

    /**
     * Get attribute values (used in getAttributeValues method)
     *
     * @param {Object} query the query object
     * @returns {Promise<count: Number, valueIDs: AttributeValue[]>} the attribute values, total items, total pages, and current page
     */
    async #getSatisfiedAttributeValues(conditions) {
        let { rows, count } = await AttributeValue.findAndCountAll({
            attributes: ["valueID"],
            where: [...conditions.attributeValueFilter],
            include: {
                model: Attribute,
                as: "attribute",
                attributes: [],
                where: [...conditions.attributeFilter],
            },
            group: ["valueID"],
            ...conditions.paginationConditions,
            order: [...conditions.sortConditions],

            subQuery: false,
            raw: true,
            distinct: true,
        });

        count = count.reduce((acc, val) => acc + val.count, 0);
        const valueIDs = rows.map((row) => row.valueID);

        return { count, valueIDs };
    }

    /**
     * Fetch attribute values (used in getAttributeValues method)
     *
     * @param {Object} conditions the conditions object
     * @param {Array} valueIDs the value IDs
     * @returns {Promise<Array>} the attribute values
     */
    async #fetchAttributeValues(conditions, valueIDs) {
        return await AttributeValue.findAll({
            where: {
                valueID: valueIDs,
            },
            include: {
                model: Attribute,
                as: "attribute",
                attributes: ["name"],
            },
            order: [...conditions.sortConditions],
        });
    }
}

export default new AttributeValueService();
