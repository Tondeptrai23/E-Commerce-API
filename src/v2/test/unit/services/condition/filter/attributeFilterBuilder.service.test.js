import AttributeFilterBuilder from "../../../../../services/condition/filter/attributeFilterBuilder.service.js";
import { Op } from "sequelize";

describe("AttributeFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new AttributeFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            name: "iPhone",
            attributeID: ["123456", "789012"],
        };
        const filterBuilder = new AttributeFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: ["iPhone"] },
                {
                    attributeID: ["123456", "789012"],
                },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            updatedAt: "[lte]2024-12-31",
            createdAt: "[gte]2024-01-01",
        };
        const filterBuilder = new AttributeFilterBuilder(query);
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
            attributeID: ["123456", "789012"],
            name: ["[like]iPhone", "Samsung"],
            updatedAt: "[lte]2024-12-31",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            extraFields: "extra",
        };
        const filterBuilder = new AttributeFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { attributeID: ["123456", "789012"] },
                { name: { [Op.like]: "%iPhone%" } },
                { name: ["Samsung"] },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.lte]: "2024-12-31" } },
            ])
        );
    });
});
