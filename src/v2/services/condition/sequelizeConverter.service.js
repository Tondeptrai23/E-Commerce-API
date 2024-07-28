/**
 * @summary Base class for converting Request.query to Sequelize-compatible condition object
 * for querying the database such as filtering, sorting and pagination
 *
 * @note This class should be extended to implement the build method
 */
export default class QueryToSequelizeConditionConverter {
    _query;
    constructor(requestQuery) {
        this._query = requestQuery;
    }

    /**
     * Base method to convert Request.query to Sequelize-compatible condition object
     * for querying the database
     *
     */
    build() {}
}
