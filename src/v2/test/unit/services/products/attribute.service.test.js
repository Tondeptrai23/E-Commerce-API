import seedData from "../../../../seedData.js";
import attributeService from "../../../../services/products/attribute.service.js";
import variantAttributeService from "../../../../services/products/variantAttribute.service.js";

beforeAll(async () => {
    await seedData();
});

describe("Attribute Service", () => {
    describe("getAttributeNames", () => {
        test("should return all attribute names", async () => {
            const names = await attributeService.getAttributeNames();

            expect(names.length).toBeGreaterThan(0);
            expect(names).toEqual(
                expect.arrayContaining([
                    "size",
                    "color",
                    "material",
                    "style",
                    "pattern",
                    "fit",
                ])
            );
        });
    });

    describe("getAttributes", () => {
        test("should return all attributes", async () => {
            const { attributes, totalPages, currentPage, totalItems } =
                await attributeService.getAttributes();

            expect(totalPages).toBeGreaterThan(0);
            expect(currentPage).toBe(1);
            expect(totalItems).toBeGreaterThan(0);
            expect(attributes.length).toBeGreaterThan(0);

            for (const attribute of attributes) {
                expect(attribute).toEqual(
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        name: expect.any(String),
                        values: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(attribute.values).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                        }),
                    ])
                );
            }
        });

        test("should return attributes with pagination", async () => {
            const { attributes, totalPages, currentPage, totalItems } =
                await attributeService.getAttributes({
                    page: 1,
                    size: 3,
                });

            expect(totalPages).toBeGreaterThan(0);
            expect(currentPage).toBe(1);
            expect(totalItems).toBeGreaterThan(3);
            expect(attributes.length).toBe(3);

            for (const attribute of attributes) {
                expect(attribute).toEqual(
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        name: expect.any(String),
                        values: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(attribute.values).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                        }),
                    ])
                );
            }

            const { attributes: attributes2, currentPage: currentPage2 } =
                await attributeService.getAttributes({
                    page: 2,
                    size: 3,
                });

            expect(currentPage2).toBe(2);
            for (const attribute of attributes2) {
                expect(attribute).toEqual(
                    expect.objectContaining({
                        attributeID: expect.any(String),
                        name: expect.any(String),
                        values: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(attribute.values).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                        }),
                    ])
                );

                expect(attributes).not.toContain(attribute);
            }
        });

        test("should return attributes with filtering", async () => {
            const { attributes } = await attributeService.getAttributes({
                name: "color",
            });

            for (const attribute of attributes) {
                expect(attribute.name).toBe("color");
            }
        });

        test("should return attributes with filtering 2", async () => {
            const { attributes } = await attributeService.getAttributes({
                name: "[like]s",
            });

            for (const attribute of attributes) {
                expect(attribute.name).toContain("s");
            }
        });

        test("should return attributes with filtering 3", async () => {
            const { attributes } = await attributeService.getAttributes({
                values: "[like]s",
            });

            for (const attribute of attributes) {
                expect(attribute.values).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.toBeOneOf([
                                expect.stringContaining("s"),
                                expect.stringContaining("S"),
                            ]),
                        }),
                    ])
                );
            }
        });

        test("should return attributes with filtering 4", async () => {
            const { attributes } = await attributeService.getAttributes({
                values: "red",
            });

            for (const attribute of attributes) {
                expect(attribute.values).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "red",
                        }),
                    ])
                );
            }
        });

        test("should return attributes with sorting", async () => {
            const { attributes } = await attributeService.getAttributes({
                sort: ["name"],
            });

            const sortedAttributes = [...attributes].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            expect(attributes).toEqual(sortedAttributes);
        });

        test("should return attributes with sorting 2", async () => {
            const { attributes } = await attributeService.getAttributes({
                sort: ["-name"],
            });

            const sortedAttributes = [...attributes].sort((a, b) =>
                b.name.localeCompare(a.name)
            );

            expect(attributes).toEqual(sortedAttributes);
        });

        test("should return attributes with sorting 3", async () => {
            const { attributes } = await attributeService.getAttributes({
                sort: ["-createdAt", "-name"],
            });

            const sortedAttributes = [...attributes].sort((a, b) => {
                if (a.createdAt > b.createdAt) {
                    return -1;
                } else if (a.createdAt < b.createdAt) {
                    return 1;
                } else {
                    return b.name.localeCompare(a.name);
                }
            });

            expect(attributes).toEqual(sortedAttributes);
        });

        test("should return attributes with sorting and pagination", async () => {
            const { attributes } = await attributeService.getAttributes({
                sort: ["-name"],
                page: 1,
                size: 3,
            });

            expect(attributes.length).toBe(3);

            const { attributes: attributes2 } =
                await attributeService.getAttributes({
                    sort: ["-name"],
                    page: 2,
                    size: 3,
                });

            expect(attributes2.length).toBe(3);

            for (let i = 0; i < attributes.length - 1; i++) {
                expect(attributes[i].name >= attributes[i + 1].name).toBe(true);
            }

            expect(
                attributes[attributes.length - 1].name >= attributes2[0].name
            ).toBe(true);
            for (let i = 0; i < attributes2.length - 1; i++) {
                expect(attributes2[i].name >= attributes2[i + 1].name).toBe(
                    true
                );
            }
        });
    });

    describe("getAttribute", () => {
        test("should return an attribute", async () => {
            const attribute = await attributeService.getAttribute("1");

            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: "1",
                    name: "size",
                    values: expect.any(Array),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(attribute.values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(attributeService.getAttribute("999")).rejects.toThrow(
                "Attribute not found"
            );
        });
    });

    describe("isAttributeNameTaken", () => {
        test("should return true if attribute name is taken", async () => {
            const isTaken = await attributeService.isAttributeNameTaken(
                "color"
            );

            expect(isTaken).toBe(true);
        });

        test("should return false if attribute name is not taken", async () => {
            const isTaken = await attributeService.isAttributeNameTaken(
                "notexists"
            );

            expect(isTaken).toBe(false);
        });
    });

    describe("createAttribute", () => {
        test("should create an attribute", async () => {
            const attribute = await attributeService.createAttribute("size2", [
                "S",
                "M",
                "L",
            ]);

            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: expect.any(String),
                    name: "size2",
                    values: expect.any(Array),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(attribute.values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );
        });

        test("should create an attribute 2", async () => {
            const attribute = await attributeService.createAttribute("color2");

            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: expect.any(String),
                    name: "color2",
                    values: expect.any(Array),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute name is taken", async () => {
            await expect(
                attributeService.createAttribute("color", [
                    "red",
                    "green",
                    "blue",
                ])
            ).rejects.toThrow("Attribute name is taken");
        });
    });

    describe("renameAttribute", () => {
        test("should rename an attribute", async () => {
            const attribute = await attributeService.renameAttribute(
                "6",
                "size3"
            );

            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: "6",
                    name: "size3",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeService.renameAttribute("999", "size3")
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if attribute name is taken", async () => {
            await expect(
                attributeService.renameAttribute("1", "color")
            ).rejects.toThrow("Attribute name is taken");
        });
    });

    describe("replaceAttribute", () => {
        test("should replace an attribute", async () => {
            const attribute = await attributeService.replaceAttribute(
                "1",
                "color4",
                ["red", "green", "blue"]
            );

            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: "1",
                    name: "color4",
                    values: expect.any(Array),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(attribute.values).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        valueID: expect.any(String),
                        value: expect.any(String),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    }),
                ])
            );

            // Check if variants are updated
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("1");
            expect(variants.length).toBe(0);
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeService.replaceAttribute("999", "color", [
                    "red",
                    "green",
                    "blue",
                ])
            ).rejects.toThrow("Attribute not found");
        });

        test("should throw an error if attribute name is taken", async () => {
            await expect(
                attributeService.replaceAttribute("6", "fit", ["S", "M", "L"])
            ).rejects.toThrow("Attribute name is taken");
        });
    });

    describe("deleteAttribute", () => {
        test("should delete an attribute", async () => {
            await attributeService.deleteAttribute("6");

            await expect(attributeService.getAttribute("6")).rejects.toThrow(
                "Attribute not found"
            );
        });

        test("should throw an error if attribute is not found", async () => {
            await expect(
                attributeService.deleteAttribute("999")
            ).rejects.toThrow("Attribute not found");
        });
    });
});
