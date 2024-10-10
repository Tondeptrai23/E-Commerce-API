import UserSortBuilder from "../../../../../services/condition/sort/userSortBuilder.service.js";
describe("UserSortBuilder", () => {
    it("should build default sort condition when no query is provided", () => {
        const query = {};
        const sortBuilder = new UserSortBuilder(query);
        const sortConditions = sortBuilder.build();
        expect(sortConditions).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sort if the sort field is not array", () => {
        const query = { sort: "userID" };
        const sortBuilder = new UserSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["userID"] };
        const sortBuilder = new UserSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["userID", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });
    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = { sort: ["-userID", "name"] };
        const sortBuilder = new UserSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["userID", "DESC"],
            ["name", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: [
                "-userID",
                "name",
                "-role",
                "createdAt",
                "isVerified",
                "updatedAt",
                "-deletedAt",
            ],
        };
        const sortBuilder = new UserSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["userID", "DESC"],
            ["name", "ASC"],
            ["role", "DESC"],
            ["createdAt", "ASC"],
            ["isVerified", "ASC"],
            ["updatedAt", "ASC"],
            ["deletedAt", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
