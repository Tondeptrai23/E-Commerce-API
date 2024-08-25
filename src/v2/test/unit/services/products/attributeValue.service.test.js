import attributeValueService from "../../../../services/products/attributeValue.service.js";
import seedData from "../../../../seedData.js";

beforeAll(async () => {
    await seedData();
});

describe("Attribute Value Service", () => {
    describe("getAttributeValues", () => {
        test("should return attribute values", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues();

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );
        });

        test("should return attribute values with pagination", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    size: "2",
                    page: "1",
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            const { values: values2, currentPage: currentPage2 } =
                await attributeValueService.getAttributeValues({
                    size: "2",
                    page: "2",
                });

            expect(currentPage2).toBe(2);
            expect(values2).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );
        });

        test("should return attribute values with filtering", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    attributeID: "5",
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: "5",
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );
        });

        test("should return attribute values with filtering 2", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    value: ["[like]f", "[like]l"],
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            for (const value of values) {
                expect(value.value.toLowerCase()).toMatch(/f|l/);
            }
        });

        test("should return attribute values with filtering 3", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    value: "[ne]loose",
                    attribute: ["color", "fit", "size"],
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            for (const value of values) {
                expect(value.value).not.toBe("loose");
                expect(["color", "fit", "size"]).toContain(
                    value.attribute.name
                );
            }
        });

        test("should return attribute values with sorting", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    sort: ["value"],
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            const { values: values2, currentPage: currentPage2 } =
                await attributeValueService.getAttributeValues({
                    sort: ["value"],
                });

            expect(currentPage2).toBe(1);
            expect(values2).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: "5",
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            for (let i = 0; i < values.length - 1; i++) {
                expect(values[i].value <= values[i + 1].value).toBe(true);
            }

            expect(values[values.length - 1] <= values2[0]).toBe(true);
            for (let i = 0; i < values2.length - 1; i++) {
                expect(values2[i].value <= values2[i + 1].value).toBe(true);
            }
        });

        test("should return attribute values with sorting 2", async () => {
            const { values, totalPages, currentPage, totalItems } =
                await attributeValueService.getAttributeValues({
                    sort: ["attributeID", "-value"],
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            const { values: values2, currentPage: currentPage2 } =
                await attributeValueService.getAttributeValues({
                    sort: ["attributeID", "-value"],
                    page: "2",
                });

            expect(currentPage2).toBe(2);
            expect(values2).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            for (let i = 0; i < values.length - 1; i++) {
                expect(values[i].attributeID <= values[i + 1].attributeID).toBe(
                    true
                );
                if (values[i].attributeID === values[i + 1].attributeID) {
                    expect(values[i].value >= values[i + 1].value).toBe(true);
                }
            }

            expect(
                values[values.length - 1].attributeID <=
                    values[0].attributeID ||
                    (values[values.length - 1].attributeID ===
                        values2[0].attributeID &&
                        values[values.length - 1] <= values2[0])
            ).toBe(true);

            for (let i = 0; i < values2.length - 1; i++) {
                expect(
                    values2[i].attributeID <= values2[i + 1].attributeID
                ).toBe(true);
                if (values2[i].attributeID === values2[i + 1].attributeID) {
                    expect(values2[i].value >= values2[i + 1].value).toBe(true);
                }
            }
        });
    });

    describe("getAttributeValue", () => {
        test("should return an attribute value", async () => {
            const value = await attributeValueService.getAttributeValue(
                "5",
                "12"
            );

            expect(value).toEqual(
                expect.objectContaining({
                    attributeID: "5",
                    valueID: "12",
                    value: "loose",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeValueService.getAttributeValue("999", "12")
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if value is not found", async () => {
            await expect(
                attributeValueService.getAttributeValue("5", "999")
            ).rejects.toThrow("Attribute value not found");
        });
    });

    describe("isAttributeValueTaken", () => {
        test("should return true if attribute value is taken", async () => {
            const isTaken = await attributeValueService.isAttributeValueTaken(
                "4",
                "floral"
            );

            expect(isTaken).toBe(true);
        });

        test("should return false if attribute value is not taken", async () => {
            const isTaken = await attributeValueService.isAttributeValueTaken(
                "1",
                "notexists"
            );

            expect(isTaken).toBe(false);
        });
    });

    describe("addAttributeValue", () => {
        test("should add an attribute value", async () => {
            const value = await attributeValueService.addAttributeValue(
                "1",
                "black"
            );

            expect(value).toEqual(
                expect.objectContaining({
                    valueID: expect.any(String),
                    value: "black",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeValueService.addAttributeValue("999", "black")
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if value is taken", async () => {
            await expect(
                attributeValueService.addAttributeValue("1", "black")
            ).rejects.toThrow("Attribute value is taken");
        });
    });

    describe("renameAttributeValue", () => {
        test("should rename an attribute value", async () => {
            const value = await attributeValueService.renameAttributeValue(
                "5",
                "12",
                "baggy"
            );

            expect(value).toEqual(
                expect.objectContaining({
                    attributeID: "5",
                    valueID: "12",
                    value: "baggy",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeValueService.renameAttributeValue("999", "12", "baggy")
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if value is not found", async () => {
            await expect(
                attributeValueService.renameAttributeValue("5", "999", "baggy")
            ).rejects.toThrow("Attribute value not found");
        });

        test("should throw an error if value is taken", async () => {
            await expect(
                attributeValueService.renameAttributeValue("5", "12", "fitted")
            ).rejects.toThrow("Attribute value is taken");
        });
    });

    describe("replaceAttributeValue", () => {
        test("should replace an attribute value", async () => {
            const value = await attributeValueService.replaceAttributeValue(
                "5",
                "12",
                "baggy2"
            );

            expect(value).toEqual(
                expect.objectContaining({
                    attributeID: "5",
                    valueID: "12",
                    value: "baggy2",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeValueService.replaceAttributeValue(
                    "999",
                    "12",
                    "fitted"
                )
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if value is not found", async () => {
            await expect(
                attributeValueService.replaceAttributeValue(
                    "5",
                    "999",
                    "fitted"
                )
            ).rejects.toThrow("Attribute value not found");
        });

        test("should throw an error if value is taken", async () => {
            await expect(
                attributeValueService.replaceAttributeValue("5", "12", "fitted")
            ).rejects.toThrow("Attribute value is taken");
        });
    });

    describe("deleteAttributeValue", () => {
        test("should delete an attribute value", async () => {
            await attributeValueService.deleteAttributeValue("5", "12");

            await expect(
                attributeValueService.getAttributeValue("5", "12")
            ).rejects.toThrow("Attribute value not found");
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeValueService.deleteAttributeValue("999", "12")
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if value is not found", async () => {
            await expect(
                attributeValueService.deleteAttributeValue("5", "999")
            ).rejects.toThrow("Attribute value not found");
        });
    });
});
