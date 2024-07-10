import { db } from "./models/index.js";
import { Attribute } from "./models/products/attribute.model.js";
import { AttributeValue } from "./models/products/attributeValue.model.js";
import { Category } from "./models/products/category.model.js";
import { Coupon } from "./models/promotion/coupon.model.js";
import { CategoryCoupon } from "./models/promotion/categoryCoupon.model.js";
import { Product } from "./models/products/product.model.js";
import { ProductCoupon } from "./models/promotion/productCoupon.model.js";
import { ProductImage } from "./models/products/productImage.model.js";
import { Variant } from "./models/products/variant.model.js";
import { VariantAttributeValue } from "./models/products/variantAttributeValue.model.js";
import { Order } from "./models/userOrder/order.model.js";
import { OrderItem } from "./models/userOrder/orderItem.model.js";
import { Payment } from "./models/userOrder/payment.model.js";
import { CartItem } from "./models/userOrder/cartItem.model.js";
import { ProductCategory } from "./models/products/productCategory.model.js";
import userService from "./services/user.service.js";

// Seed data for a fresh database for a clothes store
const seedData = async () => {
    await db.sync({ force: true });

    await seedAttribute();
    await seedAttributeValue();
    await seedCategory();
    await seedUser();
    await seedProduct();
    await seedProductCategory();
    await seedVariant();
    await setDefaultVariant();
    await seedVariantAttributeValues();
    await seedProductImage();
    await seedCoupon();
    await seedCategoryCoupon();
    await seedProductCoupon();
    await seedOrder();
    await seedPayment();
    await seedOrderItem();
    await seedCartItem();
};

export default seedData;

const seedAttribute = async () => {
    await Attribute.bulkCreate([
        { attributeID: 1, name: "size" },
        { attributeID: 2, name: "color" },
    ]);
};

const seedAttributeValue = async () => {
    await AttributeValue.bulkCreate([
        { valueID: 1, value: "S", attributeID: 1 },
        { valueID: 2, value: "M", attributeID: 1 },
        { valueID: 3, value: "L", attributeID: 1 },

        { valueID: 4, value: "black", attributeID: 2 },
        { valueID: 5, value: "white", attributeID: 2 },
        { valueID: 6, value: "blue", attributeID: 2 },
        { valueID: 7, value: "red", attributeID: 2 },
    ]);
};

const seedCategory = async () => {
    await Category.bulkCreate([
        { categoryID: 1, name: "gender", parentID: null },
        { categoryID: 2, name: "type", parentID: null },

        { categoryID: 3, name: "female", parentID: 1 },
        { categoryID: 4, name: "male", parentID: 1 },
        { categoryID: 5, name: "unisex", parentID: 1 },

        { categoryID: 6, name: "tops", parentID: 2 },
        { categoryID: 7, name: "bottoms", parentID: 2 },

        { categoryID: 8, name: "tshirt", parentID: 6 },
        { categoryID: 9, name: "blouse", parentID: 6 },

        { categoryID: 10, name: "shorts", parentID: 7 },
        { categoryID: 11, name: "skirt", parentID: 7 },
    ]);
};

const seedUser = async () => {
    const users = [
        {
            userID: 1,
            email: "user1@gmail.com",
            password: "password1",
            phone_number: "123456789",
            role: "user",
            name: "User 1",
        },
        {
            userID: 2,
            email: "user2@gmail.com",
            password: "password2",
            phone_number: "987654321",
            role: "user",
            name: "User 2",
        },
        {
            userID: 3,
            email: "user3@gmail.com",
            password: "password3",
            phone_number: "432156789",
            role: "user",
            name: "User 3",
        },
        {
            userID: 4,
            email: "admin@gmail.com",
            password: "adminpassword",
            phone_number: "987654321",
            role: "admin",
            name: "Admin 4",
        },
    ];

    users.forEach(async (user) => {
        await userService.createNewAccount(user);
    });
};

const seedProduct = async () => {
    await Product.bulkCreate([
        {
            productID: 1,
            name: "Crew Neck Short Sleeve T-Shirt",
            description:
                "A simple crew neck short sleeve t-shirt for everyday wear",
        },
        {
            productID: 2,
            name: "Denim Shorts",
            description: "Comfortable denim shorts for a casual summer look",
        },
        {
            productID: 3,
            name: "Floral Print Skirt",
            description: "A beautiful floral print skirt for a feminine touch",
        },
        {
            productID: 4,
            name: "Cargo Shorts",
            description:
                "Versatile cargo shorts for a casual and functional outfit",
        },
        {
            productID: 5,
            name: "Ruffled Blouse",
            description:
                "A feminine ruffled blouse for an elegant and chic style",
        },
        {
            productID: 6,
            name: "V-Neck Short Sleeve T-Shirt",
            description:
                "A stylish v-neck short sleeve t-shirt for a trendy look",
        },
    ]);
};

const seedProductCategory = async () => {
    await ProductCategory.bulkCreate([
        { productID: 1, categoryID: 8 },
        { productID: 1, categoryID: 5 },

        { productID: 2, categoryID: 10 },
        { productID: 2, categoryID: 5 },

        { productID: 3, categoryID: 11 },
        { productID: 3, categoryID: 4 },

        { productID: 4, categoryID: 10 },
        { productID: 4, categoryID: 5 },

        { productID: 5, categoryID: 9 },
        { productID: 5, categoryID: 3 },

        { productID: 6, categoryID: 8 },
        { productID: 6, categoryID: 4 },
    ]);
};

const seedVariant = async () => {
    await Variant.bulkCreate([
        {
            variantID: 101,
            price: 10.0,
            stock: 15,
            sku: "TSHIRT1-S-BLACK",
            imageOrder: 2,
            productID: 1,
        },
        {
            variantID: 102,
            price: 10.0,
            stock: 5,
            sku: "TSHIRT1-S-WHITE",
            imageOrder: 3,
            productID: 1,
        },
        {
            variantID: 103,
            price: 15.0,
            stock: 25,
            sku: "TSHIRT1-S-BLUE",
            imageOrder: 4,
            productID: 1,
        },
        {
            variantID: 104,
            price: 10.0,
            stock: 10,
            sku: "TSHIRT1-M-BLACK",
            imageOrder: 2,
            productID: 1,
        },
        {
            variantID: 105,
            price: 10.0,
            stock: 20,
            sku: "TSHIRT1-M-WHITE",
            imageOrder: 3,
            productID: 1,
        },
        {
            variantID: 106,
            price: 15.0,
            stock: 30,
            sku: "TSHIRT1-M-BLUE",
            imageOrder: 4,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 107,
            price: 10.0,
            stock: 1,
            sku: "TSHIRT1-L-BLACK",
            imageOrder: 2,
            productID: 1,
        },
        {
            variantID: 108,
            price: 10.0,
            stock: 12,
            sku: "TSHIRT1-L-WHITE",
            imageOrder: 3,
            productID: 1,
        },
        {
            variantID: 109,
            price: 15.0,
            stock: 8,
            sku: "TSHIRT1-L-BLUE",
            imageOrder: 4,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 201,
            price: 20.0,
            stock: 18,
            sku: "SHORT2-S-BLACK",
            imageOrder: 2,
            productID: 2,
        },
        {
            variantID: 202,
            price: 20.0,
            stock: 9,
            sku: "SHORT2-M-BLACK",
            imageOrder: 2,
            productID: 2,
        },
        {
            variantID: 203,
            price: 20.0,
            stock: 3,
            sku: "SHORT2-L-BLACK",
            imageOrder: 2,
            productID: 2,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 301,
            price: 30.0,
            stock: 27,
            sku: "SKIRT3-S-BLACK",
            imageOrder: 2,
            productID: 3,
        },
        {
            variantID: 302,
            price: 30.0,
            stock: 14,
            sku: "SKIRT3-M-BLACK",
            imageOrder: 2,
            productID: 3,
        },
        {
            variantID: 303,
            price: 30.0,
            stock: 2,
            sku: "SKIRT3-L-BLACK",
            imageOrder: 2,
            productID: 3,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 304,
            price: 40.0,
            stock: 11,
            sku: "SKIRT3-S-WHITE",
            imageOrder: 3,
            productID: 3,
        },
        {
            variantID: 305,
            price: 40.0,
            stock: 19,
            sku: "SKIRT3-M-WHITE",
            imageOrder: 3,
            productID: 3,
        },
        {
            variantID: 306,
            price: 40.0,
            stock: 28,
            sku: "SKIRT3-L-WHITE",
            imageOrder: 3,
            productID: 3,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 401,
            price: 50.0,
            stock: 13,
            sku: "SHORT4-S-BLACK",
            imageOrder: 2,
            productID: 4,
        },
        {
            variantID: 402,
            price: 50.0,
            stock: 7,
            sku: "SHORT4-M-BLACK",
            imageOrder: 2,
            productID: 4,
        },
        {
            variantID: 403,
            price: 50.0,
            stock: 21,
            sku: "SHORT4-L-BLACK",
            imageOrder: 2,
            productID: 4,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 501,
            price: 60.0,
            stock: 16,
            sku: "BLOUSE5-S-BLACK",
            imageOrder: 2,
            productID: 5,
        },
        {
            variantID: 502,
            price: 60.0,
            stock: 23,
            sku: "BLOUSE5-S-WHITE",
            imageOrder: 3,
            productID: 5,
        },
        {
            variantID: 503,
            price: 70.0,
            stock: 29,
            sku: "BLOUSE5-S-RED",
            imageOrder: 4,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 504,
            price: 60.0,
            stock: 4,
            sku: "BLOUSE5-M-BLACK",
            imageOrder: 2,
            productID: 5,
        },
        {
            variantID: 505,
            price: 60.0,
            stock: 17,
            sku: "BLOUSE5-M-WHITE",
            imageOrder: 3,
            productID: 5,
        },
        {
            variantID: 506,
            price: 70.0,
            stock: 26,
            sku: "BLOUSE5-M-RED",
            imageOrder: 4,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 507,
            price: 60.0,
            stock: 6,
            sku: "BLOUSE5-L-BLACK",
            imageOrder: 2,
            productID: 5,
        },
        {
            variantID: 508,
            price: 60.0,
            stock: 22,
            sku: "BLOUSE5-L-WHITE",
            imageOrder: 3,
            productID: 5,
        },
        {
            variantID: 509,
            price: 70.0,
            stock: 30,
            sku: "BLOUSE5-L-RED",
            imageOrder: 4,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 601,
            price: 20.0,
            stock: 25,
            sku: "TSHIRT6-S-BLACK",
            imageOrder: 2,
            productID: 6,
        },
        {
            variantID: 602,
            price: 20.0,
            stock: 8,
            sku: "TSHIRT6-M-BLACK",
            imageOrder: 2,
            productID: 6,
        },
        {
            variantID: 603,
            price: 20.0,
            stock: 3,
            sku: "TSHIRT6-L-BLACK",
            imageOrder: 2,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 604,
            price: 20.0,
            stock: 20,
            sku: "TSHIRT6-S-WHITE",
            imageOrder: 3,
            productID: 6,
        },
        {
            variantID: 605,
            price: 20.0,
            stock: 15,
            sku: "TSHIRT6-M-WHITE",
            imageOrder: 3,
            productID: 6,
        },
        {
            variantID: 606,
            price: 20.0,
            stock: 10,
            sku: "TSHIRT6-L-WHITE",
            imageOrder: 3,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 607,
            price: 20.0,
            stock: 30,
            sku: "TSHIRT6-S-BLUE",
            imageOrder: 4,
            productID: 6,
        },
        {
            variantID: 608,
            price: 20.0,
            stock: 25,
            sku: "TSHIRT6-M-BLUE",
            imageOrder: 4,
            productID: 6,
        },
        {
            variantID: 609,
            price: 20.0,
            stock: 20,
            sku: "TSHIRT6-L-BLUE",
            imageOrder: 4,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 610,
            price: 20.0,
            stock: 10,
            sku: "TSHIRT6-S-RED",
            imageOrder: 4,
            productID: 6,
        },
        {
            variantID: 611,
            price: 20.0,
            stock: 5,
            sku: "TSHIRT6-M-RED",
            imageOrder: 4,
            productID: 6,
        },
        {
            variantID: 612,
            price: 20.0,
            stock: 2,
            sku: "TSHIRT6-L-RED",
            imageOrder: 4,
            productID: 6,
        },
    ]);
};

const setDefaultVariant = async () => {
    await Product.update(
        { defaultVariantID: 101 },
        {
            where: {
                productID: 1,
            },
        }
    );

    await Product.update(
        { defaultVariantID: 201 },
        {
            where: {
                productID: 2,
            },
        }
    );

    await Product.update(
        { defaultVariantID: 301 },
        {
            where: {
                productID: 3,
            },
        }
    );

    await Product.update(
        { defaultVariantID: 401 },
        {
            where: {
                productID: 4,
            },
        }
    );

    await Product.update(
        { defaultVariantID: 501 },
        {
            where: {
                productID: 5,
            },
        }
    );

    await Product.update(
        { defaultVariantID: 601 },
        {
            where: {
                productID: 6,
            },
        }
    );
};

const seedVariantAttributeValues = async () => {
    await VariantAttributeValue.bulkCreate([
        // Product 1
        { variantID: 101, valueID: 1 },
        { variantID: 101, valueID: 4 },

        { variantID: 102, valueID: 1 },
        { variantID: 102, valueID: 5 },

        { variantID: 103, valueID: 1 },
        { variantID: 103, valueID: 6 },

        { variantID: 104, valueID: 2 },
        { variantID: 104, valueID: 4 },

        { variantID: 105, valueID: 2 },
        { variantID: 105, valueID: 5 },

        { variantID: 106, valueID: 2 },
        { variantID: 106, valueID: 6 },

        { variantID: 107, valueID: 3 },
        { variantID: 107, valueID: 4 },

        { variantID: 108, valueID: 3 },
        { variantID: 108, valueID: 5 },

        { variantID: 109, valueID: 3 },
        { variantID: 109, valueID: 6 },

        // Product 2
        { variantID: 201, valueID: 1 },
        { variantID: 201, valueID: 4 },

        { variantID: 202, valueID: 2 },
        { variantID: 202, valueID: 4 },

        { variantID: 203, valueID: 3 },
        { variantID: 203, valueID: 4 },

        // Product 3
        { variantID: 301, valueID: 1 },
        { variantID: 301, valueID: 4 },

        { variantID: 302, valueID: 2 },
        { variantID: 302, valueID: 4 },

        { variantID: 303, valueID: 3 },
        { variantID: 303, valueID: 4 },

        { variantID: 304, valueID: 1 },
        { variantID: 304, valueID: 5 },

        { variantID: 305, valueID: 2 },
        { variantID: 305, valueID: 5 },

        { variantID: 306, valueID: 3 },
        { variantID: 306, valueID: 5 },

        // Product 4
        { variantID: 401, valueID: 1 },
        { variantID: 401, valueID: 4 },

        { variantID: 402, valueID: 2 },
        { variantID: 402, valueID: 4 },

        { variantID: 403, valueID: 3 },
        { variantID: 403, valueID: 4 },

        // Product 5
        { variantID: 501, valueID: 1 },
        { variantID: 501, valueID: 4 },

        { variantID: 502, valueID: 1 },
        { variantID: 502, valueID: 5 },

        { variantID: 503, valueID: 1 },
        { variantID: 503, valueID: 7 },

        { variantID: 504, valueID: 2 },
        { variantID: 504, valueID: 4 },

        { variantID: 505, valueID: 2 },
        { variantID: 505, valueID: 5 },

        { variantID: 506, valueID: 2 },
        { variantID: 506, valueID: 7 },

        { variantID: 507, valueID: 3 },
        { variantID: 507, valueID: 4 },

        { variantID: 508, valueID: 3 },
        { variantID: 508, valueID: 5 },

        { variantID: 509, valueID: 3 },
        { variantID: 509, valueID: 7 },

        // Product 6
        { variantID: 601, valueID: 1 },
        { variantID: 601, valueID: 4 },

        { variantID: 602, valueID: 2 },
        { variantID: 602, valueID: 4 },

        { variantID: 603, valueID: 3 },
        { variantID: 603, valueID: 4 },

        { variantID: 604, valueID: 1 },
        { variantID: 604, valueID: 5 },

        { variantID: 605, valueID: 2 },
        { variantID: 605, valueID: 5 },

        { variantID: 606, valueID: 3 },
        { variantID: 606, valueID: 5 },

        { variantID: 607, valueID: 1 },
        { variantID: 607, valueID: 6 },

        { variantID: 608, valueID: 2 },
        { variantID: 608, valueID: 6 },

        { variantID: 609, valueID: 3 },
        { variantID: 609, valueID: 6 },

        { variantID: 610, valueID: 1 },
        { variantID: 610, valueID: 7 },

        { variantID: 611, valueID: 2 },
        { variantID: 611, valueID: 7 },

        { variantID: 612, valueID: 3 },
        { variantID: 612, valueID: 7 },
    ]);
};

const seedProductImage = async () => {
    await ProductImage.bulkCreate([
        { imageID: 1, productID: 1, imagePath: "tshirt1.jpg", displayOrder: 1 },
        {
            imageID: 2,
            productID: 1,
            imagePath: "tshirt1_black.jpg",
            displayOrder: 2,
        },
        {
            imageID: 3,
            productID: 1,
            imagePath: "tshirt1_white.jpg",
            displayOrder: 3,
        },
        {
            imageID: 4,
            productID: 1,
            imagePath: "tshirt1_blue.jpg",
            displayOrder: 4,
        },

        { imageID: 5, productID: 2, imagePath: "short2.jpg", displayOrder: 1 },
        {
            imageID: 6,
            productID: 2,
            imagePath: "short2_black.jpg",
            displayOrder: 2,
        },

        { imageID: 7, productID: 3, imagePath: "skirt3.jpg", displayOrder: 1 },
        {
            imageID: 8,
            productID: 3,
            imagePath: "skirt3_black.jpg",
            displayOrder: 2,
        },

        { imageID: 9, productID: 4, imagePath: "short4.jpg", displayOrder: 1 },
        {
            imageID: 10,
            productID: 4,
            imagePath: "short4_black.jpg",
            displayOrder: 2,
        },

        {
            imageID: 11,
            productID: 5,
            imagePath: "blouse5.jpg",
            displayOrder: 1,
        },
        {
            imageID: 12,
            productID: 5,
            imagePath: "blouse5_black.jpg",
            displayOrder: 2,
        },
        {
            imageID: 13,
            productID: 5,
            imagePath: "blouse5_white.jpg",
            displayOrder: 3,
        },
        {
            imageID: 14,
            productID: 5,
            imagePath: "blouse5_red.jpg",
            displayOrder: 4,
        },

        {
            imageID: 15,
            productID: 6,
            imagePath: "tshirt6.jpg",
            displayOrder: 1,
        },
        {
            imageID: 16,
            productID: 6,
            imagePath: "tshirt6_black.jpg",
            displayOrder: 2,
        },
        {
            imageID: 17,
            productID: 6,
            imagePath: "tshirt6_white.jpg",
            displayOrder: 3,
        },
        {
            imageID: 18,
            productID: 6,
            imagePath: "tshirt6_blue.jpg",
            displayOrder: 4,
        },
        {
            imageID: 19,
            productID: 6,
            imagePath: "tshirt6_red.jpg",
            displayOrder: 4,
        },
    ]);
};

const seedCoupon = async () => {
    await Coupon.bulkCreate([
        {
            couponID: 1,
            code: "10OFF",
            discountType: "percentage",
            discountVaue: 10,
            minimumOrderAmount: 20,
            timesUsed: 0,
            maxUsage: 10,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-31"),
        },
        {
            couponID: 2,
            code: "20OFF_SHORTS",
            discountType: "percentage",
            discountVaue: 20,
            timesUsed: 4,
            maxUsage: 5,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-31"),
        },
        {
            couponID: 3,
            code: "SUMMER5",
            discountType: "fixed",
            discountVaue: 5,
            timesUsed: 0,
            maxUsage: 20,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-31"),
        },
        {
            couponID: 4,
            code: "5OFF_TOPS",
            discountType: "fixed",
            discountVaue: 10,
            minimumOrderAmount: 50,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-31"),
        },
        {
            couponID: 5,
            code: "FREE_DELIVERY",
            discountType: "fixed",
            discountVaue: 0,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-31"),
        },
    ]);
};

const seedCategoryCoupon = async () => {
    await CategoryCoupon.bulkCreate([
        { couponID: 2, categoryID: 10 },
        { couponID: 4, categoryID: 6 },
    ]);
};

const seedProductCoupon = async () => {
    await ProductCoupon.bulkCreate([
        { couponID: 1, productID: 1 },
        { couponID: 1, productID: 2 },
        { couponID: 3, productID: 3 },
        { couponID: 5, productID: 5 },
    ]);
};

const seedOrder = async () => {
    await Order.bulkCreate([
        {
            orderID: 1,
            userID: 1,
            orderDate: new Date("2024-06-01"),
            status: "pending",
            shippingAddress: "123 Main St",
            totalAmount: 20.0,
        },
        {
            orderID: 2,
            userID: 2,
            orderDate: new Date("2024-06-02"),
            status: "processing",
            shippingAddress: "456 Elm St",
            totalAmount: 30.0,
        },
        {
            orderID: 3,
            userID: 3,
            orderDate: new Date("2024-06-03"),
            status: "shipped",
            shippingAddress: "789 Oak St",
            totalAmount: 40.0,
        },
        {
            orderID: 4,
            userID: 1,
            orderDate: new Date("2024-06-04"),
            status: "delivered",
            shippingAddress: "1012 Pine St",
            totalAmount: 50.0,
        },
        {
            orderID: 5,
            userID: 2,
            orderDate: new Date("2024-06-05"),
            status: "delivered",
            shippingAddress: "1314 Cedar St",
            totalAmount: 60.0,
        },
    ]);
};

const seedPayment = async () => {
    await Payment.bulkCreate([
        {
            paymentID: 1,
            orderID: 1,
            paymentDate: new Date("2024-06-01"),
            paymentMethod: "PayPal",
        },
        {
            paymentID: 2,
            orderID: 2,
            paymentDate: new Date("2024-06-02"),
            paymentMethod: "COD",
        },
        {
            paymentID: 3,
            orderID: 3,
            paymentDate: new Date("2024-06-03"),
            paymentMethod: "CreditCard",
        },
        {
            paymentID: 4,
            orderID: 4,
            paymentDate: new Date("2024-06-04"),
            paymentMethod: "COD",
        },
        {
            paymentID: 5,
            orderID: 5,
            paymentDate: new Date("2024-06-05"),
            paymentMethod: "CreditCard",
        },
    ]);
};

const seedOrderItem = async () => {
    await OrderItem.bulkCreate([
        {
            orderID: 1,
            variantID: 101,
            quantity: 1,
        },
        {
            orderID: 1,
            variantID: 201,
            quantity: 2,
        },
        {
            orderID: 1,
            variantID: 102,
            quantity: 1,
        },
        {
            orderID: 2,
            variantID: 301,
            quantity: 1,
        },
        {
            orderID: 2,
            variantID: 201,
            quantity: 2,
        },
        {
            orderID: 3,
            variantID: 301,
            quantity: 3,
        },
        {
            orderID: 4,
            variantID: 402,
            quantity: 4,
        },
        {
            orderID: 4,
            variantID: 305,
            quantity: 1,
        },
        {
            orderID: 4,
            variantID: 501,
            quantity: 5,
        },
        {
            orderID: 4,
            variantID: 104,
            quantity: 1,
        },
        {
            orderID: 4,
            variantID: 606,
            quantity: 2,
        },
        {
            orderID: 5,
            variantID: 501,
            quantity: 5,
        },
    ]);
};

const seedCartItem = async () => {
    await CartItem.bulkCreate([
        {
            userID: 1,
            variantID: 102,
            quantity: 2,
        },
        {
            userID: 1,
            variantID: 103,
            quantity: 3,
        },
        {
            userID: 1,
            variantID: 106,
            quantity: 4,
        },
        {
            userID: 2,
            variantID: 201,
            quantity: 2,
        },
        {
            userID: 2,
            variantID: 203,
            quantity: 1,
        },
        {
            userID: 2,
            variantID: 402,
            quantity: 2,
        },
        {
            userID: 2,
            variantID: 501,
            quantity: 3,
        },
        {
            userID: 2,
            variantID: 507,
            quantity: 2,
        },
        {
            userID: 3,
            variantID: 501,
            quantity: 4,
        },
        {
            userID: 3,
            variantID: 612,
            quantity: 3,
        },
    ]);
};
