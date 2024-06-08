import {
    isEmptyObject,
    convertQueryToSequelizeCondition,
} from "../../utils/utils.js";

import { Op } from "sequelize";

describe("isEmptyObject", () => {
    test("returns true if object is empty", () => {
        expect(isEmptyObject({})).toBe(true);
    });

    test("returns false if object is not empty", () => {
        expect(isEmptyObject({ name: "Something" }));
    });

    test("returns false if object is not empty", () => {
        expect(isEmptyObject({ name: "Something", price: 1000 }));
    });
});

describe("convertQueryToSequelizeCondition", () => {
    describe("convertQueryToSequelizeCondition", () => {
        test("returns an empty array if requestQuery is empty", () => {
            const requestQuery = {};
            const result = convertQueryToSequelizeCondition(requestQuery);
            expect(result).toEqual([]);
        });

        test("returns an array of conditions for a single field with a single value", () => {
            const requestQuery = { name: "Apple" };
            const result = convertQueryToSequelizeCondition(requestQuery);
            expect(result).toEqual([{ name: ["Apple"] }]);
        });

        test("returns an array of conditions for multiple fields with multiple values", () => {
            const requestQuery = {
                name: "Apple",
                price: "1000",
            };
            const result = convertQueryToSequelizeCondition(requestQuery);
            expect(result).toEqual([{ name: ["Apple"] }, { price: ["1000"] }]);
        });

        test("returns an array of conditions with comparison operators", () => {
            const requestQuery = { price: ["[gte]1000", "[lte]2000"] };
            const result = convertQueryToSequelizeCondition(requestQuery);
            expect(result).toEqual([
                { price: { [Op.gte]: "1000", [Op.lte]: "2000" } },
            ]);
        });

        test("returns an array of conditions with multiple comparison operators", () => {
            const requestQuery = {
                price: ["[between]1000,2000"],
                name: ["Apple", "Mango"],
            };
            const result = convertQueryToSequelizeCondition(requestQuery);
            expect(result).toEqual([
                { name: ["Apple", "Mango"] },
                { price: { [Op.between]: ["1000", "2000"] } },
            ]);
        });
    });
});
