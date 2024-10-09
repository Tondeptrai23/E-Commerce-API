import FilterBuilder from "./filterBuilder.service.js";

/**
 * @summary A class to build filtering conditions from a request query
 *
 * @description
 * This class is used to build filtering conditions from a request query
 * to retrieve users.
 */
export default class UserFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "userID",
            "name",
            "email",
            "role",
            "isVerified",
            "createdAt",
            "updatedAt",
            "deletedAt",
        ];
    }
}
