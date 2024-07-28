import QueryToSequelizeConditionConverter from "./sequelizeConverter.service.js";

/**
 * @summary A class to build sorting conditions from a request query
 * to retrieve a sorted data from a Sequelize magic method.
 *
 * @example
 * const sortConditions = new SortBuilder(query).build();
 *
 * @note
 * This class should be extended to implement the _mapping method
 * if the sort field names contain nested fields
 */
export default class SortBuilder extends QueryToSequelizeConditionConverter {
    constructor(requestQuery) {
        super(requestQuery);
    }

    /**
     *
     * @summary Get sorting condtions from a request query to retrieve a sorted data
     * from a Sequelize magic method.
     *
     * @returns An array of order condtions which is compatible for Sequelize sorting.
     * Ex: [["price", "DESC"], ["name", "ASC"]]
     *
     */
    build = () => {
        const sortConditions = [];
        if (!this._query || !this._query.sort) return sortConditions;
        let query;
        if (Array.isArray(this._query.sort)) {
            query = this._query.sort.flat().join(",");
        } else {
            query = this._query.sort;
        }

        query.split(",").forEach((sortString) => {
            if (sortString[0] === "-") {
                const field = sortString.substring(1);
                sortConditions.push([...this._mapping(field), "DESC"]);
                return;
            } else {
                const field = sortString;
                sortConditions.push([...this._mapping(field), "ASC"]);
            }
        });

        return sortConditions;
    };

    /**
     * @summary Get the mapping of the field names in the request query to the field names in the database
     * Should be implemented in the child class
     *
     * @protected
     * @param {string} name the name of the field in the request query
     * @returns {Object[]} the mapping of the field names in the request query to the field names in the database
     */
    _mapping(name) {
        return [name];
    }
}
