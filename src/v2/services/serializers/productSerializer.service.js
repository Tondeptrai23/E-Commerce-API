import { Product } from "../../models/products/product.model.js";
import Serializer from "./serializer.service.js";
import VariantSerializer from "./variantSerializer.service.js";
import ImageSerializer from "./imageSerializer.service.js";

class ProductSerializer extends Serializer {
    /**
     * Serialize a product object to a JSON object
     * before sending it to the client
     *
     * @param {Product} product the product object to be serialized
     * @returns {Object} the serialized product object
     */
    serialize(product) {
        product = JSON.parse(JSON.stringify(product));
        const { createdAt, updatedAt, defaultVariantID, ...result } = product;

        // Options
        if (this.includeTimestamps) {
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;
        }
        if (this.includeForeignKeys) {
            result.defaultVariantID = defaultVariantID;
        }

        // Variants
        const variantSerializer = new VariantSerializer({
            includeTimestamps: this.includeTimestamps,
            includeForeignKeys: false,
        });
        if (product.defaultVariant) {
            result.defaultVariant = variantSerializer.serialize(
                product.defaultVariant
            );
        }
        if (product.variants) {
            result.variants = product.variants.map((variant) => {
                return variantSerializer.serialize(variant);
            });
        }

        // Categories
        if (product.categories) {
            result.categories = product.categories.map((category) => {
                return category.name;
            });
        }

        // Product images
        if (product.productImages) {
            result.productImages = product.productImages.map((image) => {
                const imageSerializer = new ImageSerializer({
                    includeTimestamps: this.includeTimestamps,
                    includeForeignKeys: false,
                });
                return imageSerializer.serialize(image);
            });
        }

        return result;
    }
}

export default ProductSerializer;
