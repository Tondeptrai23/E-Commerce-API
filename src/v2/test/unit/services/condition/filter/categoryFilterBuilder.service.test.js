import CategoryFilterBuilder from "../../../../../services/condition/filter/categoryFilterBuilder.service.js";
import { Op } from "sequelize";

describe("CategoryFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new CategoryFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            name: "iPhone",
            parentID: ["123456", "789012"],
        };
        const filterBuilder = new CategoryFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: ["iPhone"] },
                { parentID: ["123456", "789012"] },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            updatedAt: "[lte]2024-12-31",
            createdAt: "[gte]2024-01-01",
        };
        const filterBuilder = new CategoryFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
            ])
        );
    });

    test("should return an array of fields with multiple comparison operators", () => {
        const query = {
            categoryID: ["123456", "789012"],
            name: ["[like]iPhone", "Samsung"],
            parentID: "123456",
            updatedAt: "[lte]2024-12-31",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            extraFields: "extra",
        };
        const filterBuilder = new CategoryFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: { [Op.like]: "%iPhone%" } },
                { name: ["Samsung"] },
                { parentID: ["123456"] },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.lte]: "2024-12-31" } },
            ])
        );
    });
});
