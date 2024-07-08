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
