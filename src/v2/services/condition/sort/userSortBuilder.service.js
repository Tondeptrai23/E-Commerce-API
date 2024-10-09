import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve users
 *
 * @example
 * const sortConditions = new UserSortBuilder(query).build();
 */
export default class UserSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            userID: ["userID"],
            name: ["name"],
            email: ["email"],
            role: ["role"],
            isVerified: ["isVerified"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
            deletedAt: ["deletedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
