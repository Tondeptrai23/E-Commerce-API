import CategorySerializer from "../../../services/serializers/categorySerializer.service.js";
import { Category } from "../../../models/products/category.model.js";

describe("CategorySerializer default", () => {
    test("should serialize a category object to a JSON object", async () => {
        const category = Category.build({
            categoryID: "12345",
            name: "Electronics",
            description: "Electronics category",
        });
        category.setDataValue("parentID", "1");

        let categorySerializer = new CategorySerializer();
        const serializedCategory = categorySerializer.serialize(category);

        expect(serializedCategory).toEqual({
            categoryID: "12345",
            name: "Electronics",
            description: "Electronics category",
            parentID: "1",
        });
    });

    test("should return an empty object if category is not provided", () => {
        let categorySerializer = new CategorySerializer();
        const serializedCategory = categorySerializer.serialize();

        expect(serializedCategory).toEqual({});
    });
});

describe("CategorySerializer without includeForeignKeys", () => {
    test("should serialize a category object to a JSON object with foreign keys", () => {
        const category = Category.build({
            categoryID: "12345",
            name: "Electronics",
            description: "Electronics category",
        });
        category.setDataValue("parentID", "1");

        let categorySerializer = new CategorySerializer({
            includeForeignKeys: false,
        });
        const serializedCategory = categorySerializer.serialize(category);

        expect(serializedCategory).toEqual({
            categoryID: "12345",
            name: "Electronics",
            description: "Electronics category",
        });
        expect(serializedCategory.parentID).toEqual(undefined);
    });
});
