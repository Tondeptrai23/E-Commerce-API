import CategorySerializer from "../../../services/serializers/category.serializer.service.js";

describe("Category Serializer", () => {
    const date = "2024-01-01T00:00:00.000Z";

    test("should serialize category data", () => {
        const category = {
            categoryID: "1",
            name: "Category 1",
            description: "Description 1",
            parentID: "2",
            extraField: "extra",

            createdAt: new Date(date),
            updatedAt: new Date(date),
        };

        const serializedCategory = CategorySerializer.parse(category);

        expect(serializedCategory).toEqual({
            categoryID: "1",
            name: "Category 1",
            description: "Description 1",
            parentID: "2",
        });
    });

    test("should serialize array of category data", () => {
        const categories = [
            {
                categoryID: "1",
                name: "Category 1",
                description: "Description 1",
                parentID: "2",
                extraField: "extra",

                createdAt: new Date(date),
                updatedAt: new Date(date),
            },
            {
                categoryID: "2",
                name: "Category 2",
                description: "Description 2",
                parentID: null,

                createdAt: new Date(date),
                updatedAt: new Date(date),
            },
        ];

        const serializedCategories = CategorySerializer.parse(categories);

        expect(serializedCategories).toEqual([
            {
                categoryID: "1",
                name: "Category 1",
                description: "Description 1",
                parentID: "2",
            },
            {
                categoryID: "2",
                name: "Category 2",
                description: "Description 2",
                parentID: null,
            },
        ]);
    });

    test("should serialize category data with includeTimestamps option", () => {
        const category = {
            categoryID: "1",
            name: "Category 1",
            description: "Description 1",
            parentID: "2",
            extraField: "extra",

            createdAt: new Date(date),
            updatedAt: new Date(date),
        };

        const serializedCategory = CategorySerializer.parse(category, {
            includeTimestamps: true,
        });

        expect(serializedCategory).toEqual({
            categoryID: "1",
            name: "Category 1",
            description: "Description 1",
            parentID: "2",

            createdAt: new Date(date),
            updatedAt: new Date(date),
        });
    });

    test("should return null fields object if no category is provided", () => {
        const serializedCategory = CategorySerializer.parse();
        expect(serializedCategory).toEqual({
            categoryID: null,
            name: null,
            description: null,
            parentID: null,
        });
    });
});
