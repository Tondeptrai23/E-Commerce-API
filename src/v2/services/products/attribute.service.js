import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import FilterBuilder from "../condition/filter/filterBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import AttributeFilterBuilder from "../condition/filter/attributeFilterBuilder.service.js";
import AttributeSortBuilder from "../condition/sort/attributeSortBuilder.service.js";
import { db } from "../../models/index.model.js";

class AttributeService {
    /**
     * Get all attribute names
     *
     * @returns {Promise<String[]>} the list of attribute names
     */
    async getAttributeNames() {
        const attributes = await Attribute.findAll({
            attributes: ["name"],
        });
        return attributes.map((attribute) => attribute.name);
    }

    /**
     * Get all attributes with values
     *
     * @returns {Promise<Attribute[]>} the list of attributes
     */
    async getAttributes(query) {
        const conditions = this.#buildConditions(query);

        const { count, attributeIDs } = await this.#getSatisifiedID(conditions);

        const attributes = await Attribute.findAll({
            where: {
                attributeID: attributeIDs,
            },
            include: {
                model: AttributeValue,
                as: "values",
                attributes: ["value"],
            },
            order: [...conditions.sortConditions],
        });

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            attributes: attributes,
        };
    }

    /**
     * Get attribute by ID
     *
     * @param {String} attributeID the attribute's ID
     * @returns {Promise<Attribute>} the attribute
     */
    async getAttribute(attributeID) {
        const attribute = await Attribute.findByPk(attributeID, {
            include: {
                model: AttributeValue,
                as: "values",
            },
        });

        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        return attribute;
    }

    /**
     * Check if attribute's name is taken
     *
     * @param {String} name the attribute's name
     * @returns {Promise<Boolean>} true if the name is taken, false otherwise
     */
    async isAttributeNameTaken(name) {
        const attribute = await Attribute.findOne({
            attributes: ["name"],
            where: {
                name: name,
            },
        });

        return attribute ? true : false;
    }

    /**
     * Create new attribute with values
     *
     * @param {String} name the attribute's name
     * @param {String[]} values the attribute's values
     * @returns {Promise<Attribute>} the created attribute
     */
    async createAttribute(name, values = []) {
        const isNameTaken = await this.isAttributeNameTaken(name);
        if (isNameTaken) {
            throw new ConflictError("Attribute name is taken");
        }

        return await db
            .transaction(async (t) => {
                const attribute = await Attribute.create({
                    name: name,
                });

                const attributeValues = await AttributeValue.bulkCreate(
                    values.map((value) => ({
                        value: value,
                        attributeID: attribute.attributeID,
                    }))
                );

                attribute.values = attributeValues;

                return attribute;
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Rename attribute
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} name the new name
     * @returns {Promise<Attribute>} the renamed
     */
    async renameAttribute(attributeID, name) {
        const attribute = await Attribute.findByPk(attributeID);
        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        // Check if name is the same
        if (attribute.name === name) {
            return attribute;
        }

        // Check if name is taken
        const isNameTaken = await this.isAttributeNameTaken(name);
        if (isNameTaken) {
            throw new ConflictError("Attribute name is taken");
        }

        attribute.name = name;
        await attribute.save();

        return attribute;
    }

    /**
     * Replace attribute
     *
     * @param {String} attributeID the attribute's ID
     * @param {String} name the new name
     * @param {String[]} values the new values
     * @returns {Promise<Attribute>} the replaced attribute
     */
    async replaceAttribute(attributeID, name, values = []) {
        let attribute = await Attribute.findByPk(attributeID);
        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        return await db
            .transaction(async (t) => {
                // Rename
                if (attribute.name !== name) {
                    const isNameTaken = await this.isAttributeNameTaken(name);
                    if (isNameTaken) {
                        throw new ConflictError("Attribute name is taken");
                    }
                    attribute.name = name;
                    attribute = await attribute.save();
                }

                // Replace attribute values
                await AttributeValue.destroy({
                    where: {
                        attributeID: attributeID,
                    },
                });

                const attributeValues = await AttributeValue.bulkCreate(
                    values.map((value) => ({
                        value: value,
                        attributeID: attribute.attributeID,
                    }))
                );

                attribute.values = attributeValues;

                return attribute;
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Delete attribute
     *
     * @param {String} attributeID the attribute's ID
     */
    async deleteAttribute(attributeID) {
        const attribute = await Attribute.findByPk(attributeID);
        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        await attribute.destroy();
    }

    /**
     *
     * The following methods are used for the getAttributes methods
     *
     */

    /**
     * Build conditions for the getAttributes method
     *
     * @param {Object} query the query object
     * @returns {Object} the conditions
     */
    #buildConditions(query) {
        const attributeFilter = new AttributeFilterBuilder(query).build();
        const attributeValueFilter = new FilterBuilder({
            value: query ? query.values : undefined,
        }).build();

        const paginationConditions = new PaginationBuilder(query).build();
        const sortConditions = new AttributeSortBuilder(query).build();

        return {
            attributeFilter,
            attributeValueFilter,
            paginationConditions,
            sortConditions,
        };
    }

    /**
     * Get all attributes that satisfy the conditions
     *
     * @param {Object} conditions the conditions to be satisfied
     * @returns {Promise<Object>} the list of attributes
     */
    async #getSatisifiedID(conditions) {
        let { count, rows } = await Attribute.findAndCountAll({
            attributes: ["attributeID"],

            where: [...conditions.attributeFilter],

            include: {
                model: AttributeValue,
                as: "values",
                attributes: [],
                where: [...conditions.attributeValueFilter],
            },

            group: ["attributeID"],
            ...conditions.paginationConditions,
            order: [...conditions.sortConditions],

            distinct: true,
            raw: true,
            subQuery: false,
        });

        count = count.reduce((acc, row) => acc + row.count, 0);
        rows = rows.map((row) => row.attributeID);

        return { count, attributeIDs: rows };
    }
}

export default new AttributeService();
