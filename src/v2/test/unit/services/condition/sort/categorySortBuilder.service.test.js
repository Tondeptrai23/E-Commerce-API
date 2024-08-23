import CategorySortBuilder from "../../../../../services/condition/sort/categorySortBuilder.service.js";

describe("CategorySortBuilder", () => {
    test("should return an array with default sorting if the query is empty", () => {
        const query = {};
        const sortBuilder = new CategorySortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sorting if the sort field is not array", () => {
        const query = { sort: "name" };
        const sortBuilder = new CategorySortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["name"] };
        const sortBuilder = new CategorySortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["name", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-categoryID", "name"] };
        const sortBuilder = new CategorySortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["categoryID", "DESC"],
            ["name", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: [
                "-categoryID",
                "name",
                "-createdAt",
                "parentID",
                "-updatedAt",
            ],
        };
        const sortBuilder = new CategorySortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["categoryID", "DESC"],
            ["name", "ASC"],
            ["createdAt", "DESC"],
            ["parentID", "ASC"],
            ["updatedAt", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
