import FilterBuilder from "../../../../services/condition/filterBuilder.service.js";
import { Op } from "sequelize";

describe("FilterBuilder", () => {
    describe("build", () => {
        test("should return an empty array if the query is empty", () => {
            const query = {};
            const filterBuilder = new FilterBuilder(query, "variant");
            const result = filterBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an array of equal fields", () => {
            const query = {
                sku: ["123456", "789012"],
                price: "1000",
            };
            const filterBuilder = new FilterBuilder(query, "variant");
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
            const filterBuilder = new FilterBuilder(query, "variant");
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
                price: "[lte]1000",
                discountPrice: "[gte]500",
                stock: "[between]10,20",
                sku: ["iPhone", "[like]Samsung"],
            };
            const filterBuilder = new FilterBuilder(query, "variant");
            const result = filterBuilder.build();
            expect(result).toEqual(
                expect.arrayContaining([
                    { price: { [Op.lte]: "1000" } },
                    { discountPrice: { [Op.gte]: "500" } },
                    { stock: { [Op.between]: ["10", "20"] } },
                    { sku: ["iPhone"] },
                    { sku: { [Op.like]: "%Samsung%" } },
                ])
            );
        });
    });
});
