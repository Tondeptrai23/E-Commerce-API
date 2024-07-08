/**
 * @class Serializer
 * @description Base class for all serializers.
 * This class is to take a Sequelize model object
 * and serialize it into a JSON object.
 * @param {Object} option - Options for the serializer
 * @param {Boolean} option.includeTimestamps - Include timestamps in the serialized data
 * @param {Boolean} option.includeForeignKeys - Include foreign keys in the serialized data
 *
 */
class Serializer {
    constructor(option = {}) {
        this.includeTimestamps =
            option.includeTimestamps === undefined
                ? false
                : option.includeTimestamps;
        this.includeForeignKeys =
            option.includeForeignKeys === undefined
                ? true
                : option.includeForeignKeys;
    }

    serialize(data) {
        // Base case
    }
}

export default Serializer;
