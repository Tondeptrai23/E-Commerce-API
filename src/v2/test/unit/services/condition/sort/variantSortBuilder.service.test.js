import VariantSortBuilder from "../../../../../services/condition/sort/variantSortBuilder.service.js";

describe("VariantSortBuilder", () => {
    test("should return an array with default sort if the query is empty", () => {
        const query = {};
        const sortBuilder = new VariantSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sort if the sort field is not array", () => {
        const query = { sort: "price" };
        const sortBuilder = new VariantSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["price"] };
        const sortBuilder = new VariantSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["price", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-price", "stock"] };
        const sortBuilder = new VariantSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["price", "DESC"],
            ["stock", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: ["-price", "-stock", "createdAt", "-productID"],
        };
        const sortBuilder = new VariantSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["price", "DESC"],
            ["stock", "DESC"],
            ["createdAt", "ASC"],
            ["productID", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
