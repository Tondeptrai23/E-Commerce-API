import ProductSortBuilder from "../../../services/condition/productSortBuilder.service.js";

describe("ProductSortBuilder", () => {
    describe("build", () => {
        test("should return an empty array if the query is empty", () => {
            const query = {};
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an empty array if the query does not contain a sort field", () => {
            const query = { name: "test" };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting", () => {
            const query = { sort: "price" };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([["variants", "price", "ASC"]]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields", () => {
            const query = { sort: ["price", "name"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["variants", "price", "ASC"],
                ["name", "ASC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "name"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["variants", "price", "DESC"],
                ["name", "ASC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "-name", "createdAt,-stock"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["variants", "price", "DESC"],
                ["name", "DESC"],
                ["createdAt", "ASC"],
                ["variants", "stock", "DESC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: "price,-name,stock,-createdAt" };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["variants", "price", "ASC"],
                ["name", "DESC"],
                ["variants", "stock", "ASC"],
                ["createdAt", "DESC"],
            ]);
        });
    });
});
