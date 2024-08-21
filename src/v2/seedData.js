import { db } from "./models/index.model.js";
import Attribute from "./models/products/attribute.model.js";
import AttributeValue from "./models/products/attributeValue.model.js";
import Category from "./models/products/category.model.js";
import Coupon from "./models/shopping/coupon.model.js";
import CategoryCoupon from "./models/shopping/categoryCoupon.model.js";
import Product from "./models/products/product.model.js";
import ProductCoupon from "./models/shopping/productCoupon.model.js";
import ProductImage from "./models/products/productImage.model.js";
import Variant from "./models/products/variant.model.js";
import VariantAttributeValue from "./models/products/variantAttributeValue.model.js";
import Order from "./models/shopping/order.model.js";
import OrderItem from "./models/shopping/orderItem.model.js";
import CartItem from "./models/shopping/cartItem.model.js";
import ProductCategory from "./models/products/productCategory.model.js";
import userService from "./services/auth/user.service.js";
import ShippingAddress from "./models/user/address.model.js";
import orderService from "./services/shopping/order.service.js";
import couponService from "./services/shopping/coupon.service.js";

// Seed data for a fresh database for a clothes store
const seedData = async () => {
    await db.sync({ force: true });

    await seedUser();
    await seedAttribute();
    await seedAttributeValue();
    await seedCategory();
    await seedProduct();
    await seedProductCategory();
    await seedProductImage();
    await seedVariant();
    await seedVariantAttributeValues();
    await seedCoupon();
    await seedCategoryCoupon();
    await seedProductCoupon();
    await seedAddress();
    await seedOrder();
    await seedOrderItem();
    await seedCartItem();
};

export default seedData;

const seedAttribute = async () => {
    await Attribute.bulkCreate([
        { attributeID: 1, name: "size" },
        { attributeID: 2, name: "color" },
        { attributeID: 3, name: "material" },
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
            role: "user",
        },
        {
            userID: 2,
            email: "user2@gmail.com",
            password: "password2",
            role: "user",
        },
        {
            userID: 3,
            email: "user3@gmail.com",
            password: "password3",
            role: "user",
        },
        {
            userID: 4,
            email: "admin@gmail.com",
            password: "adminpassword",
            name: "Admin",
            role: "admin",
        },
    ];

    for (const user of users) {
        await userService.createNewAccount(user);
    }
};

const seedAddress = async () => {
    await ShippingAddress.bulkCreate([
        {
            addressID: 101,
            userID: 1,
            address: "123 Duong Ching",
            city: "Ha Noi",
            district: "Hoan Kiem",
            phoneNumber: "123456789",
            recipientName: "User 1/1",
            paymentMethod: "COD",
        },
        {
            addressID: 102,
            userID: 1,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 1/2",
            paymentMethod: "Momo",
        },
        {
            addressID: 201,
            userID: 2,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 2/1",
            paymentMethod: "COD",
        },
        {
            addressID: 301,
            userID: 3,
            address: "789 Duong Cay",
            city: "Da Nang",
            district: "Hai Chau",
            phoneNumber: "087654321",
            recipientName: "User 3/1",
            paymentMethod: "Credit Card",
        },
    ]);
};

const seedProduct = async () => {
    await Product.bulkCreate([
        {
            productID: 0,
            name: "Pleated Mini Skirt",
            description: "A pleated mini skirt for a cute and playful outfit",
        },
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

    await Product.destroy({
        where: {
            productID: 0,
        },
    });
};

const seedProductCategory = async () => {
    await ProductCategory.bulkCreate([
        { productID: 1, categoryID: 8 },
        { productID: 1, categoryID: 5 },

        { productID: 2, categoryID: 10 },
        { productID: 2, categoryID: 5 },

        { productID: 3, categoryID: 11 },
        { productID: 3, categoryID: 3 },

        { productID: 4, categoryID: 10 },
        { productID: 4, categoryID: 5 },

        { productID: 5, categoryID: 9 },
        { productID: 5, categoryID: 3 },

        { productID: 6, categoryID: 8 },
        { productID: 6, categoryID: 4 },
    ]);
};

const seedProductImage = async () => {
    await ProductImage.bulkCreate([
        { imageID: 101, productID: 1, url: "tshirt1.jpg" },
        {
            imageID: 102,
            productID: 1,
            url: "tshirt1_black.jpg",
        },
        {
            imageID: 103,
            productID: 1,
            url: "tshirt1_white.jpg",
        },
        {
            imageID: 104,
            productID: 1,
            url: "tshirt1_blue.jpg",
        },

        { imageID: 201, productID: 2, url: "short2.jpg" },
        {
            imageID: 202,
            productID: 2,
            url: "short2_black.jpg",
        },

        { imageID: 301, productID: 3, url: "skirt3.jpg" },
        {
            imageID: 302,
            productID: 3,
            url: "skirt3_black.jpg",
        },
        {
            imageID: 303,
            productID: 3,
            url: "skirt3_white.jpg",
        },

        { imageID: 401, productID: 4, url: "short4.jpg" },
        {
            imageID: 402,
            productID: 4,
            url: "short4_black.jpg",
        },

        {
            imageID: 501,
            productID: 5,
            url: "blouse5.jpg",
        },
        {
            imageID: 502,
            productID: 5,
            url: "blouse5_black.jpg",
        },
        {
            imageID: 503,
            productID: 5,
            url: "blouse5_white.jpg",
        },
        {
            imageID: 504,
            productID: 5,
            url: "blouse5_red.jpg",
        },

        {
            imageID: 601,
            productID: 6,
            url: "tshirt6.jpg",
        },
        {
            imageID: 602,
            productID: 6,
            url: "tshirt6_black.jpg",
        },
        {
            imageID: 603,
            productID: 6,
            url: "tshirt6_white.jpg",
        },
        {
            imageID: 604,
            productID: 6,
            url: "tshirt6_blue.jpg",
        },
        {
            imageID: 605,
            productID: 6,
            url: "tshirt6_red.jpg",
        },
    ]);
};

const seedVariant = async () => {
    await Variant.bulkCreate([
        {
            variantID: "000",
            price: 50.0,
            stock: 10,
            sku: "SKIRT0-S-BLACK",
            productID: "0",
        },
        {
            variantID: "001",
            price: 50.0,
            stock: 10,
            sku: "SKIRT0-S-WHITE",
            productID: "0",
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 100,
            price: 10.0,
            stock: 15,
            sku: "TSHIRT1-S-BLACK",
            imageID: 102,
            productID: 1,
            discountPrice: 8.0,
            deletedAt: new Date("2024-06-01"),
        },
        {
            variantID: 101,
            price: 10.0,
            stock: 15,
            sku: "TSHIRT1-S-BLACK",
            imageID: 102,
            productID: 1,
            discountPrice: 8.0,
        },
        {
            variantID: 102,
            price: 10.0,
            stock: 5,
            sku: "TSHIRT1-S-WHITE",
            productID: 1,
            discountPrice: 8.0,
        },
        {
            variantID: 103,
            price: 15.0,
            stock: 25,
            sku: "TSHIRT1-S-BLUE",
            imageID: 104,
            productID: 1,
            discountPrice: 12.0,
        },
        {
            variantID: 104,
            price: 10.0,
            stock: 10,
            sku: "TSHIRT1-M-BLACK",
            imageID: 102,
            productID: 1,
        },
        {
            variantID: 105,
            price: 10.0,
            stock: 20,
            sku: "TSHIRT1-M-WHITE",
            imageID: 103,
            productID: 1,
        },
        {
            variantID: 106,
            price: 15.0,
            stock: 30,
            sku: "TSHIRT1-M-BLUE",
            imageID: 104,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 107,
            price: 10.0,
            stock: 1,
            sku: "TSHIRT1-L-BLACK",
            imageID: 102,
            productID: 1,
        },
        {
            variantID: 108,
            price: 10.0,
            stock: 12,
            sku: "TSHIRT1-L-WHITE",
            imageID: 103,
            productID: 1,
        },
        {
            variantID: 109,
            price: 15.0,
            stock: 8,
            sku: "TSHIRT1-L-BLUE",
            imageID: 104,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 201,
            price: 20.0,
            stock: 18,
            sku: "SHORT2-S-BLACK",
            imageID: 202,
            productID: 2,
        },
        {
            variantID: 202,
            price: 20.0,
            stock: 9,
            sku: "SHORT2-M-BLACK",
            imageID: 202,
            productID: 2,
        },
        {
            variantID: 203,
            price: 20.0,
            stock: 3,
            sku: "SHORT2-L-BLACK",
            imageID: 202,
            productID: 2,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 301,
            price: 30.0,
            stock: 27,
            sku: "SKIRT3-S-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 25.0,
        },
        {
            variantID: 302,
            price: 30.0,
            stock: 14,
            sku: "SKIRT3-M-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 25.0,
        },
        {
            variantID: 303,
            price: 30.0,
            stock: 2,
            sku: "SKIRT3-L-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 25.0,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 304,
            price: 40.0,
            stock: 11,
            sku: "SKIRT3-S-WHITE",
            imageID: 303,
            productID: 3,
        },
        {
            variantID: 305,
            price: 40.0,
            stock: 19,
            sku: "SKIRT3-M-WHITE",
            imageID: 303,
            productID: 3,
        },
        {
            variantID: 306,
            price: 40.0,
            stock: 28,
            sku: "SKIRT3-L-WHITE",
            imageID: 303,
            productID: 3,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 401,
            price: 50.0,
            stock: 13,
            sku: "SHORT4-S-BLACK",
            imageID: 402,
            productID: 4,
        },
        {
            variantID: 402,
            price: 50.0,
            stock: 7,
            sku: "SHORT4-M-BLACK",
            imageID: 402,
            productID: 4,
        },
        {
            variantID: 403,
            price: 50.0,
            stock: 21,
            sku: "SHORT4-L-BLACK",
            imageID: 402,
            productID: 4,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 501,
            price: 60.0,
            stock: 16,
            sku: "BLOUSE5-S-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 502,
            price: 60.0,
            stock: 23,
            sku: "BLOUSE5-S-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 503,
            price: 70.0,
            stock: 29,
            sku: "BLOUSE5-S-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 504,
            price: 60.0,
            stock: 4,
            sku: "BLOUSE5-M-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 505,
            price: 60.0,
            stock: 17,
            sku: "BLOUSE5-M-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 506,
            price: 70.0,
            stock: 26,
            sku: "BLOUSE5-M-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 507,
            price: 60.0,
            stock: 6,
            sku: "BLOUSE5-L-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 508,
            price: 60.0,
            stock: 22,
            sku: "BLOUSE5-L-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 509,
            price: 70.0,
            stock: 30,
            sku: "BLOUSE5-L-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 601,
            price: 20.0,
            stock: 25,
            sku: "TSHIRT6-S-BLACK",
            imageID: 602,
            productID: 6,
        },
        {
            variantID: 602,
            price: 20.0,
            stock: 8,
            sku: "TSHIRT6-M-BLACK",
            imageID: 602,
            productID: 6,
        },
        {
            variantID: 603,
            price: 20.0,
            stock: 3,
            sku: "TSHIRT6-L-BLACK",
            imageID: 602,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 604,
            price: 20.0,
            stock: 20,
            sku: "TSHIRT6-S-WHITE",
            imageID: 603,
            productID: 6,
        },
        {
            variantID: 605,
            price: 20.0,
            stock: 15,
            sku: "TSHIRT6-M-WHITE",
            imageID: 603,
            productID: 6,
        },
        {
            variantID: 606,
            price: 20.0,
            stock: 10,
            sku: "TSHIRT6-L-WHITE",
            imageID: 603,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 607,
            price: 20.0,
            stock: 30,
            sku: "TSHIRT6-S-BLUE",
            imageID: 604,
            productID: 6,
        },
        {
            variantID: 608,
            price: 20.0,
            stock: 25,
            sku: "TSHIRT6-M-BLUE",
            imageID: 604,
            productID: 6,
        },
        {
            variantID: 609,
            price: 20.0,
            stock: 20,
            sku: "TSHIRT6-L-BLUE",
            imageID: 604,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 610,
            price: 20.0,
            stock: 10,
            sku: "TSHIRT6-S-RED",
            imageID: 605,
            productID: 6,
        },
        {
            variantID: 611,
            price: 20.0,
            stock: 5,
            sku: "TSHIRT6-M-RED",
            imageID: 605,
            productID: 6,
        },
        {
            variantID: 612,
            price: 20.0,
            stock: 2,
            sku: "TSHIRT6-L-RED",
            imageID: 605,
            productID: 6,
        },
    ]);
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

const seedCoupon = async () => {
    await Coupon.bulkCreate([
        {
            couponID: 1,
            code: "10OFF",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            minimumOrderAmount: 20,
            timesUsed: 0,
            maxUsage: 10,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 2,
            code: "20OFF_SHORTS",
            discountType: "percentage",
            discountValue: 20,
            target: "single",
            timesUsed: 3,
            maxUsage: 5,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 3,
            code: "SUMMER5",
            discountType: "fixed",
            discountValue: 5,
            target: "single",
            timesUsed: 0,
            maxUsage: 20,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-07-1"),
        },
        {
            couponID: 4,
            code: "5OFF_TOPS",
            discountType: "fixed",
            discountValue: 10,
            target: "all",
            minimumOrderAmount: 50,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 5,
            code: "FREE_DELIVERY",
            discountType: "fixed",
            discountValue: 0,
            target: "single",
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 6,
            code: "WINTER5",
            discountType: "fixed",
            discountValue: 5,
            target: "all",
            timesUsed: 0,
            maxUsage: 20,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 7,
            code: "FLASHSALE",
            discountType: "percentage",
            discountValue: 30,
            target: "all",
            timesUsed: 0,
            maxUsage: 50,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-06-30"),
        },
        {
            couponID: 8,
            code: "FREESHIPPING",
            discountType: "fixed",
            discountValue: 2,
            target: "all",
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-06-30"),
        },
        {
            couponID: 9,
            code: "10OFF_SHORTS",
            discountType: "percentage",
            discountValue: 10,
            target: "single",
            timesUsed: 0,
            maxUsage: 10,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 10,
            code: "WINTER10",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            timesUsed: 0,
            maxUsage: 50,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-08-31"),
        },
        {
            couponID: 11,
            code: "SALE20",
            discountType: "percentage",
            discountValue: 20,
            target: "all",
            timesUsed: 0,
            maxUsage: 30,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-06-30"),
        },
    ]);
};

const seedCategoryCoupon = async () => {
    await CategoryCoupon.bulkCreate([
        { couponID: 2, categoryID: 10 },
        { couponID: 4, categoryID: 6 },
        { couponID: 6, categoryID: 3 },
        { couponID: 7, categoryID: 9 },
        { couponID: 8, categoryID: 11 },
        { couponID: 10, categoryID: 6 },
        { couponID: 11, categoryID: 7 },
    ]);
};

const seedProductCoupon = async () => {
    await ProductCoupon.bulkCreate([
        { couponID: 1, productID: 1 },
        { couponID: 1, productID: 2 },
        { couponID: 3, productID: 3 },
        {
            couponID: 7,
            productID: 4,
        },
        {
            couponID: 7,
            productID: 5,
        },
        {
            couponID: 9,
            productID: 2,
        },
        {
            couponID: 9,
            productID: 4,
        },
        {
            couponID: 10,
            productID: 1,
        },
        {
            couponID: 10,
            productID: 3,
        },
        {
            couponID: 11,
            productID: 6,
        },
    ]);
};

const seedOrder = async () => {
    await Order.bulkCreate([
        {
            orderID: 1,
            userID: 1,
            orderDate: new Date("2024-06-01"),
            status: "pending",
            shippingAddressID: 101,
        },
        {
            orderID: 2,
            userID: 2,
            orderDate: new Date("2024-06-02"),
            status: "processing",
            shippingAddressID: 201,
        },
        {
            orderID: 3,
            userID: 3,
            orderDate: new Date("2024-06-03"),
            status: "shipped",
            shippingAddressID: 301,
        },
        {
            orderID: 4,
            userID: 1,
            orderDate: new Date("2024-06-04"),
            status: "delivered",
            shippingAddressID: 102,
        },
        {
            orderID: 5,
            userID: 2,
            orderDate: new Date("2024-06-05"),
            status: "delivered",
            shippingAddressID: 201,
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

    const orders = await Order.findAll();
    for (const order of orders) {
        const orderItems = await OrderItem.findAll({
            where: { orderID: order.orderID },
        });
        let subTotal = 0;
        for (const orderItem of orderItems) {
            const variant = await Variant.findByPk(orderItem.variantID);
            subTotal += variant.price * orderItem.quantity;
        }
        await Order.update(
            { subTotal: subTotal, finalTotal: subTotal },
            { where: { orderID: order.orderID } }
        );
    }

    await couponService.applyCoupon(await Order.findByPk("1"), "10OFF");
    await couponService.applyCoupon(await Order.findByPk("2"), "20OFF_SHORTS");
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
