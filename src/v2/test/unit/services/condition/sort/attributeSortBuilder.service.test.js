import AttributeSortBuilder from "../../../../../services/condition/sort/attributeSortBuilder.service.js";

describe("AttributeSortBuilder", () => {
    test("should return an array with default sorting if the query is empty", () => {
        const query = {};
        const sortBuilder = new AttributeSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sorting if the sort field is not array", () => {
        const query = { sort: "name" };
        const sortBuilder = new AttributeSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["name"] };
        const sortBuilder = new AttributeSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["name", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-attributeID", "name"] };
        const sortBuilder = new AttributeSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["attributeID", "DESC"],
            ["name", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: ["-attributeID", "name", "-createdAt", "-updatedAt"],
        };
        const sortBuilder = new AttributeSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["attributeID", "DESC"],
            ["name", "ASC"],
            ["createdAt", "DESC"],
            ["updatedAt", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
