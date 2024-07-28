import AttributeFilterBuilder from "../../../services/condition/attributeFilterBuilder.service.js";
import attributeService from "../../../services/products/attribute.service.js";
import { jest } from "@jest/globals";

describe("AttributeFilterBuilder", () => {
    describe("create", () => {
        test("should return an instance of AttributeFilterBuilder", async () => {
            const query = { color: "red" };
            const getAttributes = jest
                .spyOn(attributeService, "getAttributes")
                .mockResolvedValueOnce([{ name: "color" }, { name: "size" }]);

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
            const attributeFilterBuilder = new AttributeFilterBuilder(
                query,
                []
            );
            const result = attributeFilterBuilder.build();
            expect(result).toEqual([]);
        });

        test("should return an array of equal fields", async () => {
            const query = { color: "red", size: "M" };
            const attributeFilterBuilder = new AttributeFilterBuilder(query, [
                "color",
                "size",
            ]);
            const result = attributeFilterBuilder.build();
            expect(result).toEqual(
                expect.arrayContaining([
                    { name: "color", value: ["red"] },
                    { name: "size", value: ["M"] },
                ])
            );
        });

        test("should return an array of fields with multiple values", async () => {
            const query = { color: ["red", "blue"], size: "M" };
            const attributeFilterBuilder = new AttributeFilterBuilder(query, [
                "color",
                "size",
            ]);
            const result = attributeFilterBuilder.build();
            expect(result).toEqual(
                expect.arrayContaining([
                    { name: "color", value: ["red", "blue"] },
                    { name: "size", value: ["M"] },
                ])
            );
        });
    });
});
