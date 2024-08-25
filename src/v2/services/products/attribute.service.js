import AttributeValue from "../../models/products/attributeValue.model.js";
import Variant from "../../models/products/variant.model.js";
import Attribute from "../../models/products/attribute.model.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import FilterBuilder from "../condition/filter/filterBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import AttributeFilterBuilder from "../condition/filter/attributeFilterBuilder.service.js";
import AttributeSortBuilder from "../condition/sort/attributeSortBuilder.service.js";

class AttributeService {
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
    async createAttribute(name, values) {
        const isNameTaken = await this.isAttributeNameTaken(name);
        if (isNameTaken) {
            throw new ConflictError("Attribute name is taken");
        }

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
    async replaceAttribute(attributeID, name, values) {
        const attribute = await Attribute.findByPk(attributeID);
        if (!attribute) {
            throw new ResourceNotFoundError("Attribute not found");
        }

        // Rename
        if (attribute.name !== name) {
            const isNameTaken = await this.isAttributeNameTaken(name);
            if (isNameTaken) {
                throw new ConflictError("Attribute name is taken");
            }
            attribute.name = name;
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
     * Rename attribute value
     *
     * @param {String} attributeValueID the attribute value's ID
     * @param {String} value the new value
     * @returns {Promise<AttributeValue>} the renamed attribute value
     */
    async renameAttributeValue(attributeValueID, value) {
        const attributeValue = await AttributeValue.findByPk(attributeValueID);
        if (!attributeValue) {
            throw new ResourceNotFoundError("Attribute value not found");
        }

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
     *
     * @param {String} attributeValueID the attribute value's ID
     * @param {String} value the new value
     * @returns {Promise<AttributeValue>} the replaced attribute value
     */
    async replaceAttributeValue(attributeValueID, value) {
        const attributeValue = await AttributeValue.findByPk(attributeValueID);
        if (!attributeValue) {
            throw new ResourceNotFoundError("Attribute value not found");
        }

        // Delete variant attribute values
        await VariantAttributeValue.destroy({
            where: {
                attributeValueID: attributeValueID,
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
    }

    /**
     * Delete attribute value
     *
     * @param {String} attributeValueID the attribute value's ID
     */
    async deleteAttributeValue(attributeValueID) {
        const attributeValue = await AttributeValue.findByPk(attributeValueID);
        if (!attributeValue) {
            throw new ResourceNotFoundError("Attribute value not found");
        }

        await attributeValue.destroy();
    }

    /**
     * Get variants that have the attribute
     *
     * @param {String} attributeID the attribute's ID
     * @returns {Promise<Variant[]>} the list of variants
     */
    async getVariantsWithAttribute(attributeID) {
        const variants = await Variant.findAll({
            include: {
                model: AttributeValue,
                as: "attributeValues",
                where: {
                    attributeID: attributeID,
                },
            },
        });
        return variants;
    }

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
            value: query.values,
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
