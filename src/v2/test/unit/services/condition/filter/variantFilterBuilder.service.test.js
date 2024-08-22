import VariantFilterBuilder from "../../../../../services/condition/filter/variantFilterBuilder.service.js";
import { Op } from "sequelize";

describe("VariantFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new VariantFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            sku: ["123456", "789012"],
            price: "1000",
        };
        const filterBuilder = new VariantFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { sku: ["123456", "789012"] },
                { price: ["1000"] },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            price: "[lte]1000",
            discountPrice: "[gte]500",
            stock: "[between]10,20",
            sku: "[like]iPhone",
        };
        const filterBuilder = new VariantFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { price: { [Op.lte]: "1000" } },
                { discountPrice: { [Op.gte]: "500" } },
                { stock: { [Op.between]: ["10", "20"] } },
                { sku: { [Op.like]: "%iPhone%" } },
            ])
        );
    });

    test("should return an array of fields with multiple comparison operators", () => {
        const query = {
            variantID: ["123456", "789012"],
            productID: "123456",
            name: ["Samsung", "[like]iPhone", "Xiaomi"],
            price: "[lte]1000",
            discountPrice: "[gte]500",
            stock: "[between]10,20",
            sku: ["iPhone", "[like]Samsung"],
            updatedAt: "[lte]2024-12-31",
            deletedAt: "[gte]2024-01-01",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            extraFields: "extra",
        };
        const filterBuilder = new VariantFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { price: { [Op.lte]: "1000" } },
                { discountPrice: { [Op.gte]: "500" } },
                { stock: { [Op.between]: ["10", "20"] } },
                { sku: ["iPhone"] },
                { sku: { [Op.like]: "%Samsung%" } },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { deletedAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.lte]: "2024-12-31" } },
                { name: { [Op.like]: "%iPhone%" } },
                { name: ["Samsung", "Xiaomi"] },
                { variantID: ["123456", "789012"] },
                { productID: ["123456"] },
            ])
        );
    });
});
