import ProductFilterBuilder from "../../../../../services/condition/filter/productFilterBuilder.service";
import { Op } from "sequelize";

describe("ProductFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new ProductFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            name: "iPhone",
            productID: ["123456", "789012"],
        };

        const filterBuilder = new ProductFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: ["iPhone"] },
                { productID: ["123456", "789012"] },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            updatedAt: "[lte]2024-12-31",
            createdAt: "[gte]2024-01-01",
        };

        const filterBuilder = new ProductFilterBuilder(query);
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
            productID: ["123456", "789012"],
            name: ["[like]iPhone", "Samsung"],
            updatedAt: "[lte]2024-12-31",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            deletedAt: "[gte]2024-01-01",
            extraFields: "extra",
        };

        const filterBuilder = new ProductFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: { [Op.like]: "%iPhone%" } },
                { name: ["Samsung"] },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                {
                    createdAt: {
                        [Op.gte]: "2024-01-01",
                    },
                },
                {
                    createdAt: {
                        [Op.lte]: "2024-12-31",
                    },
                },
                { deletedAt: { [Op.gte]: "2024-01-01" } },
                { productID: ["123456", "789012"] },
            ])
        );
    });
});
