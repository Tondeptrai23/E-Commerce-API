import { db } from "../../../../models/index.model.js";
import Variant from "../../../../models/products/variant.model.js";
import seedData from "../../../../seedData.js";
import variantAttributeService from "../../../../services/products/variantAttribute.service.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("Variant Attribute Service", () => {
    describe("getVariantsByAttribute", () => {
        test("should return variants by attribute", async () => {
            const { variants, currentPage, totalItems, totalPages } =
                await variantAttributeService.getVariantsByAttribute("3");

            expect(currentPage).toBe(1);
            expect(totalItems).toBeGreaterThan(0);
            expect(totalPages).toBeGreaterThan(0);
            expect(variants.length).toBeGreaterThan(0);
            for (const variant of variants) {
                expect(variant).toEqual(
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        attributeValues: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with pagination", async () => {
            const { variants, currentPage, totalItems, totalPages } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    page: 1,
                    size: 3,
                });

            expect(variants.length).toBe(3);
            expect(currentPage).toBe(1);
            expect(totalItems).toBeGreaterThan(3);
            expect(totalPages).toBeGreaterThan(1);

            const { variants: variants2, currentPage: currentPage2 } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    page: 2,
                    size: 3,
                });

            expect(variants2.length).toBe(3);
            expect(currentPage2).toBe(2);

            for (const variant of variants.concat(variants2)) {
                expect(variant).toEqual(
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        attributeValues: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with filtering", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    price: "[lt]50",
                });

            for (const variant of variants) {
                expect(variant.price).toBeLessThan(50);

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with filtering 2", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    price: "[between]15,20",
                    stock: "[gte]10",
                });

            for (const variant of variants) {
                expect(variant.price).toBeGreaterThanOrEqual(15);
                expect(variant.price).toBeLessThanOrEqual(20);
                expect(variant.stock).toBeGreaterThanOrEqual(10);

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with sorting", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    sort: ["price"],
                });

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price <= variants[i + 1].price).toBe(true);

                expect(variants[i].attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with sorting 2", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    sort: ["-price", "stock"],
                });

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price >= variants[i + 1].price).toBe(true);
                if (variants[i].price === variants[i + 1].price) {
                    expect(variants[i].stock <= variants[i + 1].stock).toBe(
                        true
                    );
                }

                expect(variants[i].attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return variants by attribute with sorting and pagination", async () => {
            const { variants, currentPage } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    sort: ["-price"],
                    page: 1,
                    size: 3,
                });

            expect(variants.length).toBe(3);
            expect(currentPage).toBe(1);

            const { variants: variants2, currentPage: currentPage2 } =
                await variantAttributeService.getVariantsByAttribute("3", {
                    sort: ["-price"],
                    page: 2,
                    size: 3,
                });

            expect(variants2.length).toBeLessThanOrEqual(3);
            expect(currentPage2).toBe(2);

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price >= variants[i + 1].price).toBe(true);
            }

            expect(
                variants[variants.length - 1].price >= variants2[0].price
            ).toBe(true);

            for (let i = 0; i < variants2.length - 1; i++) {
                expect(variants2[i].price >= variants2[i + 1].price).toBe(true);
            }

            for (const variant of variants.concat(variants2)) {
                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: expect.any(String),
                            attribute: expect.objectContaining({
                                name: "material",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return empty array if attribute is not found", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttribute("999");

            expect(variants.length).toBe(0);
        });
    });

    describe("getVariantByAttributeValues", () => {
        test("should return a variant by attribute values", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4"
                );

            for (const variant of variants) {
                expect(variant).toEqual(
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        attributeValues: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with pagination", async () => {
            const { variants, currentPage, totalItems, totalPages } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        page: 1,
                        size: 3,
                    }
                );

            expect(variants.length).toBe(3);
            expect(currentPage).toBe(1);
            expect(totalItems).toBeGreaterThan(3);
            expect(totalPages).toBeGreaterThan(1);

            const { variants: variants2, currentPage: currentPage2 } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        page: 2,
                        size: 3,
                    }
                );

            expect(variants2.length).toBe(3);
            expect(currentPage2).toBe(2);

            for (const variant of variants.concat(variants2)) {
                expect(variant).toEqual(
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        attributeValues: expect.any(Array),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with filtering", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        price: "[lt]50",
                    }
                );

            for (const variant of variants) {
                expect(variant.price).toBeLessThan(50);

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with filtering 2", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        price: "[between]15,20",
                        stock: "[gte]10",
                    }
                );

            for (const variant of variants) {
                expect(variant.price).toBeGreaterThanOrEqual(15);
                expect(variant.price).toBeLessThanOrEqual(20);
                expect(variant.stock).toBeGreaterThanOrEqual(10);

                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with sorting", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        sort: ["price"],
                    }
                );

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price <= variants[i + 1].price).toBe(true);

                expect(variants[i].attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with sorting 2", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        sort: ["-price", "stock"],
                    }
                );

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price >= variants[i + 1].price).toBe(true);
                if (variants[i].price === variants[i + 1].price) {
                    expect(variants[i].stock <= variants[i + 1].stock).toBe(
                        true
                    );
                }

                expect(variants[i].attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return a variant by attribute values with sorting and pagination", async () => {
            const { variants, currentPage } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        sort: ["-price"],
                        page: 1,
                        size: 3,
                    }
                );

            expect(variants.length).toBe(3);
            expect(currentPage).toBe(1);

            const { variants: variants2, currentPage: currentPage2 } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "4",
                    {
                        sort: ["-price"],
                        page: 2,
                        size: 3,
                    }
                );

            expect(variants2.length).toBeLessThanOrEqual(3);
            expect(currentPage2).toBe(2);

            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price >= variants[i + 1].price).toBe(true);
            }

            expect(
                variants[variants.length - 1].price >= variants2[0].price
            ).toBe(true);

            for (let i = 0; i < variants2.length - 1; i++) {
                expect(variants2[i].price >= variants2[i + 1].price).toBe(true);
            }

            for (const variant of variants.concat(variants2)) {
                expect(variant.attributeValues).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: "black",
                            attribute: expect.objectContaining({
                                name: "color",
                            }),
                        }),
                    ])
                );
            }
        });

        test("should return empty array if attribute is not found", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "999",
                    "2"
                );

            expect(variants.length).toBe(0);
        });

        test("should return empty array if value is not found", async () => {
            const { variants } =
                await variantAttributeService.getVariantsByAttributeValue(
                    "2",
                    "999"
                );

            expect(variants.length).toBe(0);
        });
    });

    describe("addAttributesForVariant", () => {
        test("should add attributes for variant", async () => {
            const variant =
                await variantAttributeService.addAttributesForVariant(
                    await Variant.findByPk("101"),
                    {
                        style: "formal",
                    }
                );

            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: "101",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(variant.attributeValues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        value: "formal",
                        attribute: expect.objectContaining({
                            name: "style",
                        }),
                    }),
                ])
            );
        });

        test("should ignore some attributes if not found", async () => {
            let variant = await variantAttributeService.addAttributesForVariant(
                await Variant.findByPk("102"),
                {
                    fit: "loose",
                    style: "morden",
                }
            );

            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: "102",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(variant.attributeValues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        value: "loose",
                        attribute: expect.objectContaining({
                            name: "fit",
                        }),
                    }),
                ])
            );
            expect(
                variant.attributeValues.some(
                    (v) => v.attribute.name === "style"
                )
            ).toBe(false);
        });

        test("should ignore some attributes if variant already has them", async () => {
            let variant = await variantAttributeService.addAttributesForVariant(
                await Variant.findByPk("103"),
                {
                    color: "black",
                    size: "M",
                    style: "casual",
                }
            );

            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: "103",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            expect(variant.attributeValues).toEqual(
                expect.arrayContaining([
                    // Old values
                    expect.objectContaining({
                        value: "blue",
                        attribute: expect.objectContaining({
                            name: "color",
                        }),
                    }),
                    expect.objectContaining({
                        value: "S",
                        attribute: expect.objectContaining({
                            name: "size",
                        }),
                    }),

                    // New value
                    expect.objectContaining({
                        value: "casual",
                        attribute: expect.objectContaining({
                            name: "style",
                        }),
                    }),
                ])
            );
        });

        test("should return the variant if it is not an instance of Variant", async () => {
            const variant =
                await variantAttributeService.addAttributesForVariant(
                    {
                        variantID: "999",
                    },
                    {
                        material: "cotton",
                        color: "black",
                    }
                );

            expect(variant).toEqual({
                variantID: "999",
            });
        });

        test("should return the variant if attributes are empty", async () => {
            const variant =
                await variantAttributeService.addAttributesForVariant(
                    await Variant.findByPk("101"),
                    {}
                );

            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: "101",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        test("should return the variant if attributes are null", async () => {
            const variant =
                await variantAttributeService.addAttributesForVariant(
                    await Variant.findByPk("101"),
                    null
                );

            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: "101",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });
    });
});
