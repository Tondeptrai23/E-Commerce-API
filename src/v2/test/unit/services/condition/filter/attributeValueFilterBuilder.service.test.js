import AttributeValueFilterBuilder from "../../../../../services/condition/filter/attributeValueFilterBuilder.service.js";
import { Op } from "sequelize";

describe("AttributeValueFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new AttributeValueFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            value: "iPhone",
            attributeID: ["123456", "789012"],
        };
        const filterBuilder = new AttributeValueFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { value: ["iPhone"] },
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
        const filterBuilder = new AttributeValueFilterBuilder(query);
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
            value: ["[like]iPhone", "Samsung"],
            valueID: ["[ne]extra"],
            updatedAt: "[lte]2024-12-31",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            extraFields: "extra",
        };
        const filterBuilder = new AttributeValueFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { attributeID: ["123456", "789012"] },
                { value: { [Op.like]: "%iPhone%" } },
                { value: ["Samsung"] },
                { valueID: { [Op.ne]: "extra" } },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.lte]: "2024-12-31" } },
            ])
        );
    });
});
