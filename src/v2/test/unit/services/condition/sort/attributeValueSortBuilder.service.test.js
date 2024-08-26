import AttributeValueSortBuilder from "../../../../../services/condition/sort/attributeValueSortBuilder.service.js";

describe("AttributeValueSortBuilder", () => {
    test("should return an array with default sorting if the query is empty", () => {
        const query = {};
        const sortBuilder = new AttributeValueSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sorting if the sort field is not array", () => {
        const query = { sort: "value" };
        const sortBuilder = new AttributeValueSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["value"] };
        const sortBuilder = new AttributeValueSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["value", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-valueID", "value"] };
        const sortBuilder = new AttributeValueSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["valueID", "DESC"],
            ["value", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: [
                "-valueID",
                "value",
                "-createdAt",
                "attributeID",
                "-updatedAt",
            ],
        };
        const sortBuilder = new AttributeValueSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["valueID", "DESC"],
            ["value", "ASC"],
            ["createdAt", "DESC"],
            ["attributeID", "ASC"],
            ["updatedAt", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
