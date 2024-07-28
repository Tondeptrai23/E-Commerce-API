import SortBuilder from "../../../services/condition/sortBuilder.service.js";

describe("SortBuilder", () => {
    describe("build", () => {
        test("should return an empty array if the query is empty", () => {
            const query = {};
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an empty array if the query does not contain a sort field", () => {
            const query = { name: "test" };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting", () => {
            const query = { sort: "price" };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([["price", "ASC"]]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields", () => {
            const query = { sort: ["price", "name"] };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["price", "ASC"],
                ["name", "ASC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "name"] };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["price", "DESC"],
                ["name", "ASC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "-name"] };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["price", "DESC"],
                ["name", "DESC"],
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: "price,-name" };
            const sortBuilder = new SortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                ["price", "ASC"],
                ["name", "DESC"],
            ]);
        });
    });
});
