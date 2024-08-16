import AttributeFilterBuilder from "../../../../services/condition/attributeFilterBuilder.service.js";
import attributeService from "../../../../services/products/attribute.service.js";
import { jest } from "@jest/globals";
import { db } from "../../../../models/index.model.js";
import { Op } from "sequelize";

describe("AttributeFilterBuilder", () => {
    describe("create", () => {
        test("should return an instance of AttributeFilterBuilder", async () => {
            const query = { color: "red" };
            const getAttributes = jest
                .spyOn(attributeService, "getAttributes")
                .mockResolvedValueOnce([
                    { name: "color" },
                    { name: "size" },
                    { name: "brand" },
                ]);

            const attributeFilterBuilder = await AttributeFilterBuilder.create(
                query
            );
            expect(attributeFilterBuilder).toBeInstanceOf(
                AttributeFilterBuilder
            );
            expect(getAttributes).toHaveBeenCalled();
        });
    });

    describe("build", () => {
        test("should return an empty array if the query is empty", async () => {
            const query = {};
            const attributeFilterBuilder = new AttributeFilterBuilder(query, [
                "color",
                "size",
                "brand",
            ]);
            const result = attributeFilterBuilder.build();
            expect(result.havingCondition).toEqual(
                db.literal("COUNT(DISTINCT `attributeValues`.`valueID`) >= 0")
            );
            expect(result.whereCondition).toEqual([]);
        });

        test("should return an array of equal fields", async () => {
            const query = { color: "red", size: "M" };
            const attributeFilterBuilder = new AttributeFilterBuilder(query, [
                "color",
                "size",
                "brand",
            ]);
            const result = attributeFilterBuilder.build();
            expect(result.havingCondition).toEqual(
                db.literal("COUNT(DISTINCT `attributeValues`.`valueID`) >= 2")
            );
            expect(result.whereCondition).toEqual([
                {
                    [Op.or]: [
                        {
                            "$attributeValues.attribute.name$": "color",
                            "$attributeValues.value$": ["red"],
                        },
                        {
                            "$attributeValues.attribute.name$": "size",
                            "$attributeValues.value$": ["M"],
                        },
                    ],
                },
            ]);
        });

        test("should return an array of fields with multiple values", async () => {
            const query = { color: ["red", "blue"], size: "M", brand: "nike" };
            const attributeFilterBuilder = new AttributeFilterBuilder(query, [
                "color",
                "size",
                "brand",
            ]);
            const result = attributeFilterBuilder.build();

            expect(result.havingCondition).toEqual(
                db.literal("COUNT(DISTINCT `attributeValues`.`valueID`) >= 3")
            );
            expect(result.whereCondition).toEqual([
                {
                    [Op.or]: [
                        {
                            "$attributeValues.attribute.name$": "color",
                            "$attributeValues.value$": ["red", "blue"],
                        },
                        {
                            "$attributeValues.attribute.name$": "size",
                            "$attributeValues.value$": ["M"],
                        },
                        {
                            "$attributeValues.attribute.name$": "brand",
                            "$attributeValues.value$": ["nike"],
                        },
                    ],
                },
            ]);
        });
    });
});
