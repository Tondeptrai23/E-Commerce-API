import UserFilterBuilder from "../../../../../services/condition/filter/userFilterBuilder.service.js";
import { Op } from "sequelize";

describe("UserFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new UserFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            name: "John",
            updatedAt: "2021-01-01",
        };
        const filterBuilder = new UserFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: ["John"] },
                { updatedAt: ["2021-01-01"] },
            ])
        );
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            name: ["[ne]John", "[like]Doe"],
            createdAt: ["[gt]2021-01-01"],
        };
        const filterBuilder = new UserFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { name: { [Op.ne]: "John" } },
                { name: { [Op.like]: "%Doe%" } },
                { createdAt: { [Op.gt]: "2021-01-01" } },
            ])
        );
    });

    test("should return an array of fields with multiple comparison operators", () => {
        const query = {
            userID: ["[ne]1", "[gt]2"],
            name: ["[ne]John", "[like]Doe", "Jane", "David"],
            role: "[ne]admin",
            createdAt: "[gt]2021-01-01",
            updatedAt: "[lt]2021-12-31",
            deletedAt: ["[between]2021-01-01,2021-12-31", "2022-01-01"],
        };
        const filterBuilder = new UserFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual(
            expect.arrayContaining([
                { userID: { [Op.ne]: "1" } },
                { userID: { [Op.gt]: "2" } },
                { name: { [Op.ne]: "John" } },
                { name: { [Op.like]: "%Doe%" } },
                { name: ["Jane", "David"] },
                { role: { [Op.ne]: "admin" } },
                { createdAt: { [Op.gt]: "2021-01-01" } },
                { updatedAt: { [Op.lt]: "2021-12-31" } },
                { deletedAt: { [Op.between]: ["2021-01-01", "2021-12-31"] } },
                { deletedAt: ["2022-01-01"] },
            ])
        );
    });
});
