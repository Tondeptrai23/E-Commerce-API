import CouponSortBuilder from "../../../services/condition/couponSortBuilder.service.js";

describe("CouponSortBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an empty array if the query does not contain a sort field", () => {
        const query = { name: "test" };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: "discountValue" };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["discountValue", "ASC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields", () => {
        const query = { sort: ["discountValue", "timesUsed"] };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["discountValue", "ASC"],
            ["timesUsed", "ASC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-discountValue", "timesUsed"] };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["discountValue", "DESC"],
            ["timesUsed", "ASC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: ["-discountValue", "-timesUsed", "createdAt,-endDate"],
        };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["discountValue", "DESC"],
            ["timesUsed", "DESC"],
            ["createdAt", "ASC"],
            ["endDate", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: "maxUsage,-discountValue,endDate,-createdAt" };
        const sortBuilder = new CouponSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["maxUsage", "ASC"],
            ["discountValue", "DESC"],
            ["endDate", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });
});
