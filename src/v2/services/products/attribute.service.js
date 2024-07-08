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
}

export default new AttributeService();
