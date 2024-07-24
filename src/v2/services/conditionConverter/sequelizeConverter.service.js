export default class QueryToSequelizeConditionConverter {
    _query;
    constructor(requestQuery) {
        this._query = requestQuery;
    }

    /**
     * Base method to convert Request.query to Sequelize-compatible condition object
     * for querying the database
     */
    convert() {}
}
