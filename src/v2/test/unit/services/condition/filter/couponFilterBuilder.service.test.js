import CouponFilterBuilder from "../../../../../services/condition/filter/couponFilterBuilder.service.js";
import { Op } from "sequelize";

describe("CouponFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new CouponFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            code: ["123456", "789012"],
            discountValue: "1000",
        };
        const filterBuilder = new CouponFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { code: ["123456", "789012"] },
                { discountValue: ["1000"] },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            code: "[like]iPhone",
            discountType: "percentage",
            discountValue: "[gte]500",
            maxUsage: "[between]10,20",
        };
        const filterBuilder = new CouponFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { code: { [Op.like]: "%iPhone%" } },
                { discountValue: { [Op.gte]: "500" } },
                { maxUsage: { [Op.between]: ["10", "20"] } },
                { discountType: ["percentage"] },
            ])
        );
    });

    test("should return an array of fields with multiple comparison operators", () => {
        const query = {
            code: ["123456", "789012"],
            discountType: "percentage",
            discountValue: "[gte]500",
            target: "single",
            minimumOrderAmount: ["[gte]1000", "[lte]2000"],
            timesUsed: "[between]10,20",
            maxUsage: "10",
            startDate: "[gte]2024-01-01",
            endDate: "[lte]2024-12-31",
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            updatedAt: ["2024-01-03", "[lte]2024-12-31", "2024-01-01"],
            extraFields: "extra",
        };
        const filterBuilder = new CouponFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { code: ["123456", "789012"] },
                { discountType: ["percentage"] },
                { discountValue: { [Op.gte]: "500" } },
                { target: ["single"] },
                { minimumOrderAmount: { [Op.gte]: "1000" } },
                { minimumOrderAmount: { [Op.lte]: "2000" } },
                { timesUsed: { [Op.between]: ["10", "20"] } },
                { maxUsage: ["10"] },
                { startDate: { [Op.gte]: "2024-01-01" } },
                { endDate: { [Op.lte]: "2024-12-31" } },
                { createdAt: { [Op.gte]: "2024-01-01" } },
                { createdAt: { [Op.lte]: "2024-12-31" } },
                { updatedAt: { [Op.lte]: "2024-12-31" } },
                { updatedAt: ["2024-01-03", "2024-01-01"] },
            ])
        );
    });
});
