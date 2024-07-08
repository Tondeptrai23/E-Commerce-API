import { Category } from "../../models/products/category.model.js";
import Serializer from "./serializer.service.js";

class CategorySerializer extends Serializer {
    /**
     *
     * Serialize a category object to a JSON object
     * before sending it to the client
     *
     * @param {Category} category the category object to be serialized
     * @returns {Object} the serialized category object
     */
    serialize(category) {
        category = JSON.parse(JSON.stringify(category));

        const { createdAt, updatedAt, parentID, ...result } = category;

        if (this.includeTimestamps) {
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;
        }

        if (this.includeForeignKeys) {
            result.parentID = parentID;
        }

        return result;
    }
}

export default CategorySerializer;
