import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../../utils.integration.js";
import path from "path";

/**
 * Set up
 */
let accessToken = "";
let accessTokenUser = "";
beforeAll(async () => {
    // Seed data
    await seedData();

    // Get access token
    const res = await request(app).post("/api/v2/auth/signin").send({
        email: "admin@gmail.com",
        password: "adminpassword",
    });
    accessToken = res.body.accessToken;

    const resUser = await request(app).post("/api/v2/auth/signin").send({
        email: "user1@gmail.com",
        password: "password1",
    });
    accessTokenUser = resUser.body.accessToken;
});

/**
 * Tests
 */
describe("POST /admin/products", () => {
    it("should create a product without images", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New Product",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU123",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                    {
                        name: "New Variant 2",
                        price: 200,
                        discountPrice: 150,
                        stock: 20,
                        sku: "SKU234",
                        attributes: {
                            color: "blue",
                            size: "L",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: "New Product",
                    description: "New Product Description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                    categories: expect.any(Array),
                }),
            })
        );

        expect(res.body.product.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: "New Variant",
                price: 100,
                stock: 10,
                sku: "SKU123",
                imageID: null,
                attributes: expect.objectContaining({
                    color: "red",
                    size: "M",
                }),
            }),
            expect.objectContaining({
                variantID: expect.any(String),
                name: "New Variant 2",
                price: 200,
                discountPrice: 150,
                stock: 20,
                sku: "SKU234",
                imageID: null,
                attributes: expect.objectContaining({
                    color: "blue",
                    size: "L",
                }),
            })
        );

        expect(res.body.product.categories).toEqual(
            expect.arrayContaining(["tshirt"])
        );
    });

    it("should create a product without images 2", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New Product 2",
                description: "New Product Description",
                variants: [
                    {
                        price: 100,
                        stock: 10,
                        sku: "SKU345",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
            });

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: "New Product 2",
                    description: "New Product Description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                }),
            })
        );

        expect(res.body.product.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: "New Product 2",
                price: 100,
                stock: 10,
                sku: "SKU345",
                attributes: expect.objectContaining({
                    color: "red",
                    size: "M",
                }),
            })
        );
    });

    it("should create a product with images", async () => {
        const productData = {
            name: "New Product 3",
            description: "New Product Description",
            variants: [
                {
                    name: "New Variant",
                    price: 100,
                    stock: 10,
                    sku: "SKU456",
                    imageIndex: 0,
                    attributes: {
                        color: "red",
                        size: "M",
                    },
                },
            ],
            categories: ["tshirt"],
        };

        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .field("product", JSON.stringify(productData))
            .attach("images", path.resolve(process.cwd(), "db_diagram.png"));

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: "New Product 3",
                    description: "New Product Description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                    categories: expect.any(Array),
                    images: expect.any(Array),
                }),
            })
        );

        expect(res.body.product.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: "New Variant",
                price: 100,
                stock: 10,
                sku: "SKU456",
                attributes: expect.objectContaining({
                    color: "red",
                    size: "M",
                }),
                imageID: res.body.product.images[0].imageID,
            })
        );

        expect(res.body.product.categories).toEqual(
            expect.arrayContaining(["tshirt"])
        );

        for (let i = 0; i < res.body.product.images.length; i++) {
            expect(res.body.product.images[i]).toEqual(
                expect.objectContaining({
                    imageID: expect.any(String),
                    url: expect.any(String),
                    displayOrder: i + 1,
                })
            );
        }
    });

    it("should create a product with images 2", async () => {
        const productData = {
            name: "New Product 4",
            description: "New Product Description",
            variants: [
                {
                    price: 100,
                    stock: 10,
                    sku: "SKU567",
                    imageIndex: 2,
                    attributes: {
                        color: "red",
                        size: "M",
                    },
                },
                {
                    price: 100,
                    stock: 10,
                    sku: "SKU678",
                    imageIndex: 1,
                    attributes: {
                        color: "red",
                        size: "L",
                    },
                },
            ],
        };

        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .field("product", JSON.stringify(productData))
            .attach("images", path.resolve(process.cwd(), "db_diagram.png"))
            .attach("images", path.resolve(process.cwd(), "db_diagram.png"))
            .attach("images", path.resolve(process.cwd(), "db_diagram.png"));

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: "New Product 4",
                    description: "New Product Description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                    images: expect.any(Array),
                }),
            })
        );

        expect(res.body.product.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: "New Product 4",
                price: 100,
                stock: 10,
                sku: "SKU567",
                attributes: expect.objectContaining({
                    color: "red",
                    size: "M",
                }),
                imageID: res.body.product.images[2].imageID,
            })
        );

        for (let i = 0; i < res.body.product.images.length; i++) {
            expect(res.body.product.images[i]).toEqual(
                expect.objectContaining({
                    imageID: expect.any(String),
                    url: expect.any(String),
                    displayOrder: i + 1,
                })
            );
        }
    });

    it("should return 400 if request body is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New Product",
                description: "New Product Description",
                categories: ["tshirt"],
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
    });

    it("should return 409 if variant's SKU already exists", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New Product 3456",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU123",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );

        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "Conflict",
                message: "SKU is already taken",
            })
        );

        // Check if the product is not created
        const resProducts = await request(app).get("/api/v2/products").query({
            size: "20",
        });
        expect(
            resProducts.body.products.every(
                (p) => p.name !== "New Product 3456"
            )
        ).toBe(true);
    });

    it("should return 409 if product name already exists", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Crew Neck Short Sleeve T-Shirt",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU567",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );

        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "Conflict",
                message: "Product name is taken",
            })
        );
    });

    it("should return 401 if access token is missing", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .send({
                name: "New Product",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU123",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if access token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer 123`)
            .send({
                name: "New Product",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU123",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                name: "New Product",
                description: "New Product Description",
                variants: [
                    {
                        name: "New Variant",
                        price: 100,
                        stock: 10,
                        sku: "SKU123",
                        attributes: {
                            color: "red",
                            size: "M",
                        },
                    },
                ],
                categories: ["tshirt"],
            });

        assertNotAnAdmin(res);
    });
});
