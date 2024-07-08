import { ProductImage } from "../../models/products/productImage.model.js";
import Serializer from "./serializer.service.js";

class ImageSerializer extends Serializer {
    /**
     * Serialize a product image object to a JSON object
     * before sending it to the client
     *
     * @param {ProductImage} image the product image object to be serialized
     * @returns {Object} the serialized product image object
     */
    serialize(image) {
        if (!image) {
            return {};
        }

        image = JSON.parse(JSON.stringify(image));
        const { createdAt, updatedAt, productID, ...result } = image;
        if (this.includeTimestamps) {
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;
        }

        if (this.includeForeignKeys) {
            result.productID = productID;
        }

        return result;
    }
}

export default ImageSerializer;
