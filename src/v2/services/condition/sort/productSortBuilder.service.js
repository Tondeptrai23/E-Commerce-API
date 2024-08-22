import SortBuilder from "./sortBuilder.service.js";

/**
 * @summary A class to build sorting conditions from a request
 * query to retrieve products
 *
 * @example
 * const sortConditions = new ProductSortBuilder(query).build();
 */
export default class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            productID: "`product`.`productID`",
            name: "`product`.`name`",
            createdAt: "`product`.`createdAt`",
            updatedAt: "`product`.`updatedAt`",

            price: "`variant`.`price`",
            discountPrice: "`variant`.`discountPrice`",
            stock: "`variant`.`stock`",
        };
        this._defaultSort = "`product`.`createdAt` DESC";
    }

    build = () => {
        const sortConditions = [];
        if (
            !this._query ||
            !this._query.sort ||
            !Array.isArray(this._query.sort)
        ) {
            return [this._defaultSort];
        }
        let query = this._query.sort;

        query.forEach((sortString) => {
            if (sortString[0] === "-") {
                const field = sortString.substring(1);
                sortConditions.push(this._mapping(field) + " DESC");
                return;
            } else {
                const field = sortString;
                sortConditions.push(this._mapping(field) + " ASC");
            }
        });
        sortConditions.push(this._defaultSort);

        return sortConditions;
    };
}
