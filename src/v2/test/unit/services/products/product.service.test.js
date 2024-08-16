import productService from "../../../../services/products/product.service.js";
import seedData from "../../../../seedData.js";
import { ResourceNotFoundError } from "../../../../utils/error.js";
import Variant from "../../../../models/products/variant.model.js";
import Attribute from "../../../../models/products/attribute.model.js";
import AttributeValue from "../../../../models/products/attributeValue.model.js";
import productCategoryService from "../../../../services/products/productCategory.service.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("ProductService", () => {
    describe("ProductService.getProducts", () => {
        test("should return all products", async () => {
            const { products } = await productService.getProducts({});
            expect(products).toHaveLength(5);

            expect(products[0]).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                })
            );
        });

        /*
         * Filtering tests
         */
        test("should return products that match the product's name", async () => {
            const { products } = await productService.getProducts({
                name: "[like]T-Shirt",
            });

            expect(products).toBeInstanceOf(Array);
            expect(products[0]).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.stringContaining("T-Shirt"),
                    description: expect.any(String),
                })
            );
        });

        test("should return products that belong to categories", async () => {
            const { products } = await productService.getProducts({
                category: ["tshirt", "blouse"],
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                expect(product).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.any(String),
                        description: expect.any(String),
                        categories: expect.arrayContaining([
                            expect.objectContaining({
                                categoryID: expect.any(String),
                                name: expect.stringMatching(/tshirt|blouse/),
                            }),
                        ]),
                    })
                );
            }
        });

        test("should return products that belong to a big category", async () => {
            const { products } = await productService.getProducts({
                category: "tops",
            });

            expect(products).toBeInstanceOf(Array);
            const productsBelongToCategory =
                await productCategoryService.getProductsByAncestorCategory(
                    "tops"
                );

            for (const product of products) {
                expect(product).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.any(String),
                        description: expect.any(String),
                        categories: expect.arrayContaining([
                            expect.objectContaining({
                                categoryID: expect.any(String),
                                name: expect.any(String),
                            }),
                        ]),
                    })
                );
            }

            expect(products).toHaveLength(productsBelongToCategory.length);
            // Extract IDs of two products variables
            const productIDs = products.map((product) => product.productID);
            const productsBelongToCategoryIDs = productsBelongToCategory.map(
                (product) => product.productID
            );
            // Check if the two arrays are equal
            expect(productIDs).toEqual(
                expect.arrayContaining(productsBelongToCategoryIDs)
            );
        });

        test("should return products that match the variant's price and stock", async () => {
            const { products } = await productService.getProducts({
                variant: {
                    price: "[lte]25",
                    stock: "[gte]10",
                },
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                expect(product).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.any(String),
                        description: expect.any(String),
                        variants: expect.arrayContaining([
                            expect.objectContaining({
                                variantID: expect.any(String),
                                price: expect.any(Number),
                                stock: expect.any(Number),
                            }),
                        ]),
                    })
                );

                for (const variant of product.variants) {
                    expect(variant.price).toBeLessThanOrEqual(25);
                    expect(variant.stock).toBeGreaterThanOrEqual(10);
                }
            }
        });

        test("should return products that match the attribute's value", async () => {
            const { products } = await productService.getProducts({
                attributes: {
                    color: "red",
                },
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                for (const variant of product.variants) {
                    const foundVariant = await Variant.findByPk(
                        variant.variantID,
                        {
                            include: {
                                model: AttributeValue,
                                as: "attributeValues",
                                include: {
                                    model: Attribute,
                                    as: "attribute",
                                },
                            },
                        }
                    );

                    expect(foundVariant.attributeValues).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                value: "red",
                                attribute: expect.objectContaining({
                                    name: "color",
                                }),
                            }),
                        ])
                    );
                }
            }
        });

        test("should return products that match two attribute's value", async () => {
            const { products } = await productService.getProducts({
                attributes: {
                    color: "red",
                    size: "L",
                },
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                for (const variant of product.variants) {
                    const foundVariant = await Variant.findByPk(
                        variant.variantID,
                        {
                            include: {
                                model: AttributeValue,
                                as: "attributeValues",
                                include: {
                                    model: Attribute,
                                    as: "attribute",
                                },
                            },
                        }
                    );

                    expect(foundVariant.attributeValues).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                value: "red",
                                attribute: expect.objectContaining({
                                    name: "color",
                                }),
                            }),
                            expect.objectContaining({
                                value: "L",
                                attribute: expect.objectContaining({
                                    name: "size",
                                }),
                            }),
                        ])
                    );
                }
            }
        });

        test("should return products that match multiple conditions", async () => {
            const { products } = await productService.getProducts({
                name: "[like]T-Shirt",
                category: "tshirt",
                variant: {
                    price: "[lte]25",
                    stock: "[gte]10",
                },
                attributes: {
                    color: "red",
                    size: "S",
                },
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                expect(product).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.stringContaining("T-Shirt"),
                        description: expect.any(String),
                        categories: expect.arrayContaining([
                            expect.objectContaining({
                                categoryID: expect.any(String),
                                name: expect.stringContaining("tshirt"),
                            }),
                        ]),
                        variants: expect.arrayContaining([
                            expect.objectContaining({
                                variantID: expect.any(String),
                                price: expect.any(Number),
                                stock: expect.any(Number),
                            }),
                        ]),
                    })
                );

                for (const variant of product.variants) {
                    const foundVariant = await Variant.findByPk(
                        variant.variantID,
                        {
                            include: {
                                model: AttributeValue,
                                as: "attributeValues",
                                include: {
                                    model: Attribute,
                                    as: "attribute",
                                },
                            },
                        }
                    );

                    expect(foundVariant.attributeValues).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                value: "red",
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
                        ])
                    );
                }
            }
        });

        /*
         * Sorting tests
         */
        test("should return products sorted by name in ascending order", async () => {
            const { products } = await productService.getProducts({
                sort: ["name"],
            });

            expect(products).toBeInstanceOf(Array);
            const productNames = products.map((product) => product.name);
            const sortedProductNames = [...productNames].sort();
            expect(productNames).toEqual(sortedProductNames);
        });

        test("should return products sorted by name in descending order", async () => {
            const { products } = await productService.getProducts({
                sort: ["-name"],
            });

            expect(products).toBeInstanceOf(Array);
            const productNames = products.map((product) => product.name);
            const sortedProductNames = [...productNames].sort().reverse();
            expect(productNames).toEqual(sortedProductNames);
        });

        test("should return products sorted by price in ascending order", async () => {
            const { products } = await productService.getProducts({
                sort: ["price"],
            });

            expect(products).toBeInstanceOf(Array);
            for (const product of products) {
                const prices = product.variants.map((variant) => variant.price);
                const sortedPrices = [...prices].sort();
                expect(prices).toEqual(sortedPrices);
            }
        });

        test("should return products sorted by name and price", async () => {
            const { products } = await productService.getProducts({
                sort: ["name", "-price"],
            });

            expect(products).toBeInstanceOf(Array);
            const productNames = products.map((product) => product.name);
            const sortedProductNames = [...productNames].sort();
            expect(productNames).toEqual(sortedProductNames);

            for (const product of products) {
                const prices = product.variants.map((variant) => variant.price);
                const sortedPrices = [...prices].sort().reverse();
                expect(prices).toEqual(sortedPrices);
            }
        });

        /*
         * Filtering + Sorting tests
         */
        test("should return products that match the product's name and sorted by name in ascending order", async () => {
            const { products } = await productService.getProducts({
                name: "[like]T-Shirt",
                sort: ["name", "-price"],
            });

            expect(products).toBeInstanceOf(Array);

            const productNames = products.map((product) => product.name);
            const sortedProductNames = [...productNames].sort();
            expect(productNames).toEqual(sortedProductNames);

            for (const product of products) {
                expect(product).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.stringContaining("T-Shirt"),
                        description: expect.any(String),
                    })
                );

                const prices = product.variants.map((variant) => variant.price);
                const sortedPrices = [...prices].sort().reverse();
                expect(prices).toEqual(sortedPrices);
            }
        });

        /*
         * Pagination tests
         */
        test("should return products with pagination", async () => {
            const { products, currentPage, totalPages, totalItems } =
                await productService.getProducts({
                    size: 3,
                    page: 1,
                });

            expect(products).toBeInstanceOf(Array);
            expect(products).toHaveLength(3);
            expect(products[0].productID).toBe("1");

            expect(currentPage).toBe(1);
            expect(totalPages).toBe(2);
            expect(totalItems).toBe(6);
        });

        test("should return products with pagination", async () => {
            const { products, currentPage, totalPages, totalItems } =
                await productService.getProducts({
                    size: 3,
                    page: 2,
                });

            expect(products).toBeInstanceOf(Array);
            expect(products).toHaveLength(3);
            expect(products[0].productID).toBe("4");

            expect(currentPage).toBe(2);
            expect(totalPages).toBe(2);
            expect(totalItems).toBe(6);
        });

        test("should return products with default pagination values", async () => {
            const { products, currentPage, totalPages, totalItems } =
                await productService.getProducts({});

            expect(products).toBeInstanceOf(Array);
            expect(products).toHaveLength(5);
            expect(products[0].productID).toBe("1");

            expect(currentPage).toBe(1);
            expect(totalPages).toBe(2);
            expect(totalItems).toBe(6);
        });

        // Pagination + sorting test
        test("should return products with pagination and sorting", async () => {
            const { products, currentPage, totalPages, totalItems } =
                await productService.getProducts({
                    sort: ["price"],
                    size: 3,
                    page: 1,
                });

            const {
                products: products2,
                currentPage: currentPage2,
                totalPages: totalPages2,
                totalItems: totalItems2,
            } = await productService.getProducts({
                sort: ["price"],
                size: 3,
                page: 2,
            });

            expect(products).toBeInstanceOf(Array);
            expect(products).toHaveLength(3);
            // Assert sorting
            for (let i = 0; i < products.length - 1; i++) {
                expect(products[i].variants[0].price).toBeLessThanOrEqual(
                    products[i + 1].variants[0].price
                );
            }

            // Assert pagination
            expect(currentPage).toBe(1);
            expect(currentPage2).toBe(2);
            expect(products2[0].variants[0].price).toBeGreaterThanOrEqual(
                products[2].variants[0].price
            );
            for (let i = 0; i < products2.length - 1; i++) {
                expect(products2[i].variants[0].price).toBeLessThanOrEqual(
                    products2[i + 1].variants[0].price
                );
            }
        });
    });

    describe("ProductService.getProduct", () => {
        test("should return a product with the given productID", async () => {
            const productID = "1";
            const product = await productService.getProduct(productID);

            expect(product).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: expect.any(String),
                    description: expect.any(String),
                })
            );

            expect(product.images).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        imageID: expect.any(String),
                        url: expect.any(String),
                    }),
                ])
            );

            expect(product.variants).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        variantID: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                    }),
                ])
            );

            expect(product.categories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        categoryID: expect.any(String),
                    }),
                ])
            );
        });

        test("should return null when the product is not found", async () => {
            const productID = "999";
            const product = await productService.getProduct(productID, {});

            expect(product).toBeNull();
        });
    });

    describe("ProductService.isProductNameTaken", () => {
        test("should return true if the product name is taken", async () => {
            const productName = "Cargo Shorts";
            const isTaken = await productService.isProductNameTaken(
                productName
            );

            expect(isTaken).toBe(true);
        });

        test("should return false if the product name is not taken", async () => {
            const productName = "New Product";
            const isTaken = await productService.isProductNameTaken(
                productName
            );

            expect(isTaken).toBe(false);
        });
    });

    describe("ProductService.updateProduct", () => {
        test("should update a product with the given productID", async () => {
            const productID = "1";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
            };

            const updatedProduct = await productService.updateProduct(
                productID,
                updatedProductInfo
            );

            expect(updatedProduct).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: "Updated Product",
                    description: "Updated description",
                })
            );
        });

        test("should throw ResourceNotFoundError when the product is not found", async () => {
            const productID = "999";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
            };

            await expect(
                productService.updateProduct(productID, updatedProductInfo)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("ProductService.deleteProduct", () => {
        test("should delete a product with the given productID", async () => {
            const productID = "1";
            await productService.deleteProduct(productID);

            const product = await productService.getProduct(productID, {
                includeDeleted: false,
            });
            expect(product).toBeNull();

            const deletedProduct = await productService.getProduct(productID, {
                includeDeleted: true,
            });
            expect(deletedProduct).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: expect.any(String),
                    description: expect.any(String),
                    deletedAt: expect.any(Date),
                })
            );
        });

        test("should throw ResourceNotFoundError when the product is not found", async () => {
            const productID = "999";
            await expect(
                productService.deleteProduct(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
