import SequelizeQueryBuilder from "../../services/sequelizeQueryBuilder.js";
import { Op } from "sequelize";

const builder = new SequelizeQueryBuilder();

describe("SequelizeQueryBuilder.convertFilterCondition", () => {
    test("returns an empty array if requestQuery is empty", () => {
        const requestQuery = {};
        const result = builder.convertFilterCondition(requestQuery);
        expect(result).toEqual([]);
    });

    test("returns an array of conditions for a single field with a single value", () => {
        const requestQuery = { name: "Apple" };
        const result = builder.convertFilterCondition(requestQuery);
        expect(result).toEqual([{ name: ["Apple"] }]);
    });

    test("returns an array of conditions for multiple fields with multiple values", () => {
        const requestQuery = {
            name: "Apple",
            price: "1000",
        };
        const result = builder.convertFilterCondition(requestQuery);
        expect(result).toEqual([{ name: ["Apple"] }, { price: ["1000"] }]);
    });

    test("returns an array of conditions with comparison operators", () => {
        const requestQuery = { price: ["[gte]1000", "[lte]2000"] };
        const result = builder.convertFilterCondition(requestQuery);
        expect(result).toEqual([
            { price: { [Op.gte]: "1000", [Op.lte]: "2000" } },
        ]);
    });

    test("returns an array of conditions with multiple comparison operators", () => {
        const requestQuery = {
            price: ["[between]1000,2000"],
            name: ["Apple", "Mango"],
        };
        const result = builder.convertFilterCondition(requestQuery);
        expect(result).toEqual([
            { name: ["Apple", "Mango"] },
            { price: { [Op.between]: ["1000", "2000"] } },
        ]);
    });
});

describe("SequelizeQueryBuilder.convertSortCondition", () => {
    test("returns an empty array if requestQuery is empty", () => {
        const requestQuery = {};
        const result = builder.convertSortCondition(requestQuery);
        expect(result).toEqual([]);
    });

    test("returns an array of order conditions for a single field", () => {
        const requestQuery = {
            sort: ["price,DESC"],
        };
        const result = builder.convertSortCondition(requestQuery);
        expect(result).toEqual([["price", "DESC"]]);
    });

    test("returns an array of order conditions for multiple fields", () => {
        const requestQuery = {
            sort: ["price,DESC", "name,ASC"],
            name: "Apple",
        };
        const result = builder.convertSortCondition(requestQuery);
        expect(result).toEqual([
            ["price", "DESC"],
            ["name", "ASC"],
        ]);
    });
});

describe("SequelizeQueryBuilder.convertPaginationCondition", () => {
    test("should return default limit and offset if page and size is undefined", () => {
        const requestQuery = { name: "something" };
        const result = builder.convertPaginationCondition(requestQuery);
        expect(result).toEqual({ limit: 20, offset: 0 });
    });

    test("should return limit and offset values from requestQuery", () => {
        const requestQuery = { page: 2, size: 20 };
        const result = builder.convertPaginationCondition(requestQuery);
        expect(result).toEqual({ limit: 20, offset: 20 });
    });
});
