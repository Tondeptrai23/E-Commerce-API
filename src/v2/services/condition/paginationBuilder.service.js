import QueryToSequelizeConditionConverter from "./sequelizeConverter.service.js";

/**
 * @summary Class for converting Request.query to Sequelize-compatible condition object for pagination
 *
 */
export default class PaginationBuilder extends QueryToSequelizeConditionConverter {
    constructor(requestQuery) {
        super(requestQuery);
    }

    /**
     * @summary Get the limit and offset values from the request query
     *
     * @returns {Object} An object contains the limit and offset values
     */
    build = () => {
        const DEFAULT_OFFSET = 0;
        const DEFAULT_SIZE = 5;

        if (!this._query)
            return { limit: DEFAULT_SIZE, offset: DEFAULT_OFFSET };
        const { page, size } = this._query;

        if (!page && !size)
            return { limit: DEFAULT_SIZE, offset: DEFAULT_OFFSET };

        if (!page) {
            return { limit: parseInt(size), offset: DEFAULT_OFFSET };
        }

        if (!size) {
            return {
                limit: DEFAULT_SIZE,
                offset: (parseInt(page) - 1) * DEFAULT_SIZE,
            };
        }

        return {
            limit: parseInt(size),
            offset: (parseInt(page) - 1) * parseInt(size),
        };
    };
}
