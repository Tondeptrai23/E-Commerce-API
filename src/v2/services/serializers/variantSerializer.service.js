import Variant from "../../models/products/variant.model.js";
import Serializer from "./serializer.service.js";

class VariantSerializer extends Serializer {
    /**
     * Serialize a variant object to a JSON object
     * before sending it to the client
     *
     * @param {Variant} variant the variant object to be serialized
     * @returns {Object} the serialized variant object
     */
    serialize(variant) {
        if (!variant) {
            return {};
        }

        variant = JSON.parse(JSON.stringify(variant));

        const { createdAt, updatedAt, productID, attributeValues, ...result } =
            variant;

        if (this.includeTimestamps) {
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;
        }

        if (this.includeForeignKeys) {
            result.productID = productID;
        }

        if (attributeValues) {
            const attributes = {};
            for (const item of attributeValues) {
                attributes[item.attribute.name.toLowerCase()] = item.value;
            }
            result.attributes = attributes;
        }

        return result;
    }
}

export default VariantSerializer;
