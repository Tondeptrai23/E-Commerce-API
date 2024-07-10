import { AttributeValue } from "../../models/products/attributeValue.model.js";
import { Variant } from "../../models/products/variant.model.js";
import { VariantAttributeValue } from "../../models/products/variantAttributeValue.model.js";
import { Attribute } from "../../models/products/attribute.model.js";

class AttributeService {
    /**
     * Get all attributes' names that match the given options
     *
     * @param {Object} options the options for the query
     * @returns {Promise<String[]>} the attributes' names that match the given options
     */
    async getAttributes() {
        const attributes = await Attribute.findAll({
            attributes: ["name"],
        });
        return attributes;
    }

    /**
     * Get attribute name by attributeID
     *
     * @param {String} attributeID the attribute ID to be retrieved
     * @returns {Promise<String>} the attribute name with the given attributeID
     */
    async getAttributeName(attributeID) {
        const attribute = await Attribute.findByPk(attributeID);
        return attribute.name;
    }

    /**
     * Add attributes for variant
     *
     * @param {String} variant the variant ID to be added attributes
     * @param {Object[]} attributes the attributes to be added
     * @returns {Promise<Variant>} the variant with the added attributes
     */
    async addAttributesForVariant(variant, attributes) {
        const variantAttributes = await Promise.all(
            Object.entries(attributes).map(async ([name, value]) => {
                const attributeValue = await AttributeValue.findOne({
                    where: {
                        value: value,
                    },
                    include: {
                        model: Attribute,
                        as: "attribute",
                        where: {
                            name: name,
                        },
                    },
                });
                await variant.addAttributeValue(attributeValue);

                return attributeValue;
            })
        );

        variant.dataValues.attributeValues = variantAttributes;
        return variant;
    }
}

export default new AttributeService();
