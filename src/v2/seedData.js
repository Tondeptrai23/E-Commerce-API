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
import userService from "./services/users/user.service.js";
import Address from "./models/user/address.model.js";
import ShippingAddress from "./models/shopping/shippingAddress.model.js";
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
    await seedOrderItem2();
};

export default seedData;

const seedAttribute = async () => {
    await Attribute.bulkCreate([
        { attributeID: 1, name: "size" },
        { attributeID: 2, name: "color" },

        // Additional attributes for testing attribute filtering
        { attributeID: 3, name: "material" },
        { attributeID: 4, name: "pattern" },
        { attributeID: 5, name: "fit" },
        { attributeID: 6, name: "style" },
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

        // Additional attribute values for testing attribute filtering
        { valueID: 8, value: "cotton", attributeID: 3 },
        { valueID: 9, value: "polyester", attributeID: 3 },
        { valueID: 10, value: "floral", attributeID: 4 },
        { valueID: 11, value: "striped", attributeID: 4 },
        { valueID: 12, value: "loose", attributeID: 5 },
        { valueID: 13, value: "fitted", attributeID: 5 },
        { valueID: 14, value: "casual", attributeID: 6 },
        { valueID: 15, value: "formal", attributeID: 6 },
        { valueID: 16, value: "v-neck", attributeID: 6 },
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
            isVerified: true,
        },
        {
            userID: 2,
            email: "user2@gmail.com",
            password: "password2",
            role: "user",
            isVerified: true,
        },
        {
            userID: 3,
            email: "user3@gmail.com",
            password: "password3",
            role: "user",
            isVerified: true,
        },
        {
            userID: 4,
            email: "admin@gmail.com",
            password: "adminpassword",
            name: "Admin",
            role: "admin",
            isVerified: true,
        },
    ];

    for (const user of users) {
        await userService.createNewAccount(user);
    }
};

const seedAddress = async () => {
    await ShippingAddress.bulkCreate([
        {
            shippingAddressID: 101,
            address: "123 Duong Ching",
            city: "Ha Noi",
            district: "Hoan Kiem",
            phoneNumber: "123456789",
            recipientName: "User 1/1",
        },
        {
            shippingAddressID: 102,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 1/2",
        },
        {
            shippingAddressID: 201,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 2/1",
        },
        {
            shippingAddressID: 301,
            address: "789 Duong Cay",
            city: "Da Nang",
            district: "Hai Chau",
            phoneNumber: "087654321",
            recipientName: "User 3/1",
        },
        {
            shippingAddressID: 401,
            address: "123 Duong Ching",
            city: "Ha Noi",
            district: "Hoan Kiem",
            phoneNumber: "123456789",
            recipientName: "Admin 1",
        },
    ]);

    await Address.bulkCreate([
        {
            addressID: 101,
            userID: 1,
            address: "123 Duong Ching",
            city: "Ha Noi",
            district: "Hoan Kiem",
            phoneNumber: "123456789",
            recipientName: "User 1/1",
            isDefault: true,
        },
        {
            addressID: 102,
            userID: 1,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 1/2",
        },
        {
            addressID: 201,
            userID: 2,
            address: "456 Duong Pho",
            city: "Ho Chi Minh City",
            district: "Quan 1",
            phoneNumber: "087654321",
            recipientName: "User 2/1",
            isDefault: true,
        },
        {
            addressID: 301,
            userID: 3,
            address: "789 Duong Cay",
            city: "Da Nang",
            district: "Hai Chau",
            phoneNumber: "087654321",
            recipientName: "User 3/1",
            isDefault: true,
        },
        {
            addressID: 401,
            userID: 4,
            address: "123 Duong Ching",
            city: "Ha Noi",
            district: "Hoan Kiem",
            phoneNumber: "123456789",
            recipientName: "Admin 1",
            isDefault: true,
        },
    ]);
};

const seedProduct = async () => {
    await Product.bulkCreate([
        {
            productID: 0,
            name: "Pleated Mini Skirt",
            description: "A pleated mini skirt for a cute and playful outfit",
            createdAt: new Date("2024-06-01"),
        },
        {
            productID: 1,
            name: "Crew Neck Short Sleeve T-Shirt",
            description:
                "A simple crew neck short sleeve t-shirt for everyday wear",
            createdAt: new Date("2024-07-01"),
        },
        {
            productID: 2,
            name: "Denim Shorts",
            description: "Comfortable denim shorts for a casual summer look",
            createdAt: new Date("2024-08-01"),
        },
        {
            productID: 3,
            name: "Floral Print Skirt",
            description: "A beautiful floral print skirt for a feminine touch",
            createdAt: new Date("2024-09-01"),
        },
        {
            productID: 4,
            name: "Cargo Shorts",
            description:
                "Versatile cargo shorts for a casual and functional outfit",
            createdAt: new Date("2024-7-15"),
        },
        {
            productID: 5,
            name: "Ruffled Blouse",
            description:
                "A feminine ruffled blouse for an elegant and chic style",
            createdAt: new Date("2024-07-01"),
        },
        {
            productID: 6,
            name: "V-Neck Short Sleeve T-Shirt",
            description:
                "A stylish v-neck short sleeve t-shirt for a trendy look",
            createdAt: new Date("2024-08-10"),
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
        { imageID: 101, productID: 1, contentType: "image/jpeg" },
        { imageID: 102, productID: 1, contentType: "image/png" },
        { imageID: 103, productID: 1, contentType: "image/gif" },
        { imageID: 104, productID: 1, contentType: "image/bmp" },

        { imageID: 201, productID: 2, contentType: "image/jpeg" },
        { imageID: 202, productID: 2, contentType: "image/png" },

        { imageID: 301, productID: 3, contentType: "image/gif" },
        { imageID: 302, productID: 3, contentType: "image/bmp" },
        { imageID: 303, productID: 3, contentType: "image/jpeg" },

        { imageID: 401, productID: 4, contentType: "image/png" },
        { imageID: 402, productID: 4, contentType: "image/gif" },

        { imageID: 501, productID: 5, contentType: "image/bmp" },
        { imageID: 502, productID: 5, contentType: "image/jpeg" },
        { imageID: 503, productID: 5, contentType: "image/png" },
        { imageID: 504, productID: 5, contentType: "image/gif" },

        { imageID: 601, productID: 6, contentType: "image/bmp" },
        { imageID: 602, productID: 6, contentType: "image/jpeg" },
        { imageID: 603, productID: 6, contentType: "image/png" },
        { imageID: 604, productID: 6, contentType: "image/gif" },
        { imageID: 605, productID: 6, contentType: "image/bmp" },
    ]);
};

const seedVariant = async () => {
    await Variant.bulkCreate([
        {
            variantID: "000",
            price: 5000,
            stock: 10,
            sku: "SKIRT0-S-BLACK",
            productID: "0",
        },
        {
            variantID: "001",
            price: 5000,
            stock: 10,
            sku: "SKIRT0-S-WHITE",
            productID: "0",
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 100,
            price: 1000,
            stock: 15,
            sku: "TSHIRT1-S-BLACK",
            imageID: 102,
            productID: 1,
            discountPrice: 800,
            deletedAt: new Date("2024-06-01"),
        },
        {
            variantID: 101,
            price: 1000,
            stock: 15,
            sku: "TSHIRT1-S-BLACK",
            imageID: 102,
            productID: 1,
            discountPrice: 800,
        },
        {
            variantID: 102,
            price: 1000,
            stock: 5,
            sku: "TSHIRT1-S-WHITE",
            productID: 1,
            discountPrice: 800,
        },
        {
            variantID: 103,
            price: 1500,
            stock: 25,
            sku: "TSHIRT1-S-BLUE",
            imageID: 104,
            productID: 1,
            discountPrice: 1200,
        },
        {
            variantID: 104,
            price: 1000,
            stock: 10,
            sku: "TSHIRT1-M-BLACK",
            imageID: 102,
            productID: 1,
        },
        {
            variantID: 105,
            price: 1000,
            stock: 20,
            sku: "TSHIRT1-M-WHITE",
            imageID: 103,
            productID: 1,
        },
        {
            variantID: 106,
            price: 1500,
            stock: 30,
            sku: "TSHIRT1-M-BLUE",
            imageID: 104,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 107,
            price: 1000,
            stock: 1,
            sku: "TSHIRT1-L-BLACK",
            imageID: 102,
            productID: 1,
        },
        {
            variantID: 108,
            price: 1000,
            stock: 12,
            sku: "TSHIRT1-L-WHITE",
            imageID: 103,
            productID: 1,
        },
        {
            variantID: 109,
            price: 1500,
            stock: 8,
            sku: "TSHIRT1-L-BLUE",
            imageID: 104,
            productID: 1,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 201,
            price: 2000,
            stock: 18,
            sku: "SHORT2-S-BLACK",
            imageID: 202,
            productID: 2,
        },
        {
            variantID: 202,
            price: 2000,
            stock: 9,
            sku: "SHORT2-M-BLACK",
            imageID: 202,
            productID: 2,
        },
        {
            variantID: 203,
            price: 2000,
            stock: 3,
            sku: "SHORT2-L-BLACK",
            imageID: 202,
            productID: 2,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 300,
            price: 3000,
            stock: 27,
            sku: "SKIRT3-DELETED",
            productID: 3,
            deletedAt: new Date("2024-06-01"),
        },
        {
            variantID: 301,
            price: 3000,
            stock: 27,
            sku: "SKIRT3-S-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 2500,
        },
        {
            variantID: 302,
            price: 3000,
            stock: 14,
            sku: "SKIRT3-M-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 2500,
        },
        {
            variantID: 303,
            price: 3000,
            stock: 2,
            sku: "SKIRT3-L-BLACK",
            imageID: 302,
            productID: 3,
            discountPrice: 2500,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 304,
            price: 4000,
            stock: 11,
            sku: "SKIRT3-S-WHITE",
            imageID: 303,
            productID: 3,
        },
        {
            variantID: 305,
            price: 4000,
            stock: 19,
            sku: "SKIRT3-M-WHITE",
            imageID: 303,
            productID: 3,
        },
        {
            variantID: 306,
            price: 4000,
            stock: 28,
            sku: "SKIRT3-L-WHITE",
            imageID: 303,
            productID: 3,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 400,
            price: 5000,
            stock: 13,
            sku: "SHORT4-DELETED",
            productID: 4,
            deletedAt: new Date("2024-06-01"),
        },
        {
            variantID: 401,
            price: 5000,
            stock: 13,
            sku: "SHORT4-S-BLACK",
            imageID: 402,
            productID: 4,
        },
        {
            variantID: 402,
            price: 5000,
            stock: 7,
            sku: "SHORT4-M-BLACK",
            imageID: 402,
            productID: 4,
        },
        {
            variantID: 403,
            price: 5000,
            stock: 21,
            sku: "SHORT4-L-BLACK",
            imageID: 402,
            productID: 4,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 501,
            price: 6000,
            stock: 16,
            sku: "BLOUSE5-S-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 502,
            price: 6000,
            stock: 23,
            sku: "BLOUSE5-S-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 503,
            price: 7000,
            stock: 29,
            sku: "BLOUSE5-S-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 504,
            price: 6000,
            stock: 4,
            sku: "BLOUSE5-M-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 505,
            price: 6000,
            stock: 17,
            sku: "BLOUSE5-M-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 506,
            price: 7000,
            stock: 26,
            sku: "BLOUSE5-M-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 507,
            price: 6000,
            stock: 6,
            sku: "BLOUSE5-L-BLACK",
            imageID: 502,
            productID: 5,
        },
        {
            variantID: 508,
            price: 6000,
            stock: 22,
            sku: "BLOUSE5-L-WHITE",
            imageID: 503,
            productID: 5,
        },
        {
            variantID: 509,
            price: 7000,
            stock: 30,
            sku: "BLOUSE5-L-RED",
            imageID: 504,
            productID: 5,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 601,
            price: 2000,
            stock: 25,
            sku: "TSHIRT6-S-BLACK",
            imageID: 602,
            productID: 6,
        },
        {
            variantID: 602,
            price: 2000,
            stock: 8,
            sku: "TSHIRT6-M-BLACK",
            imageID: 602,
            productID: 6,
        },
        {
            variantID: 603,
            price: 2000,
            stock: 3,
            sku: "TSHIRT6-L-BLACK",
            imageID: 602,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 604,
            price: 2000,
            stock: 20,
            sku: "TSHIRT6-S-WHITE",
            imageID: 603,
            productID: 6,
        },
        {
            variantID: 605,
            price: 2000,
            stock: 15,
            sku: "TSHIRT6-M-WHITE",
            imageID: 603,
            productID: 6,
        },
        {
            variantID: 606,
            price: 2000,
            stock: 10,
            sku: "TSHIRT6-L-WHITE",
            imageID: 603,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 607,
            price: 2000,
            stock: 30,
            sku: "TSHIRT6-S-BLUE",
            imageID: 604,
            productID: 6,
        },
        {
            variantID: 608,
            price: 2000,
            stock: 25,
            sku: "TSHIRT6-M-BLUE",
            imageID: 604,
            productID: 6,
        },
        {
            variantID: 609,
            price: 2000,
            stock: 20,
            sku: "TSHIRT6-L-BLUE",
            imageID: 604,
            productID: 6,
        },
    ]);

    await Variant.bulkCreate([
        {
            variantID: 610,
            price: 2000,
            stock: 10,
            sku: "TSHIRT6-S-RED",
            imageID: 605,
            productID: 6,
        },
        {
            variantID: 611,
            price: 2000,
            stock: 5,
            sku: "TSHIRT6-M-RED",
            imageID: 605,
            productID: 6,
        },
        {
            variantID: 612,
            price: 2000,
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
        { variantID: 101, valueID: 8 },

        { variantID: 102, valueID: 1 },
        { variantID: 102, valueID: 5 },
        { variantID: 102, valueID: 8 },

        { variantID: 103, valueID: 1 },
        { variantID: 103, valueID: 6 },
        { variantID: 103, valueID: 9 },

        { variantID: 104, valueID: 2 },
        { variantID: 104, valueID: 4 },
        { variantID: 104, valueID: 8 },

        { variantID: 105, valueID: 2 },
        { variantID: 105, valueID: 5 },
        { variantID: 105, valueID: 8 },

        { variantID: 106, valueID: 2 },
        { variantID: 106, valueID: 6 },
        { variantID: 106, valueID: 9 },

        { variantID: 107, valueID: 3 },
        { variantID: 107, valueID: 4 },
        { variantID: 107, valueID: 8 },

        { variantID: 108, valueID: 3 },
        { variantID: 108, valueID: 5 },
        { variantID: 108, valueID: 8 },

        { variantID: 109, valueID: 3 },
        { variantID: 109, valueID: 6 },
        { variantID: 109, valueID: 9 },

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
            endDate: new Date("2024-09-31"),
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
            endDate: new Date("2024-09-31"),
        },
        {
            couponID: 3,
            code: "SUMMER5",
            discountType: "fixed",
            discountValue: 500,
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
            discountValue: 1000,
            target: "all",
            minimumOrderAmount: 50,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-31"),
        },
        {
            couponID: 5,
            code: "FREE_DELIVERY",
            discountType: "fixed",
            discountValue: 0,
            target: "single",
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-31"),
        },
        {
            couponID: 6,
            code: "WINTER5",
            discountType: "fixed",
            discountValue: 500,
            target: "all",
            timesUsed: 0,
            maxUsage: 20,
            startDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-31"),
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
            discountValue: 2000,
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
            endDate: new Date("2024-09-31"),
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
            endDate: new Date("2024-09-31"),
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
            status: "pending",
            paymentMethod: "COD",
            shippingAddressID: 101,
        },
        {
            orderID: 2,
            userID: 2,
            status: "processing",
            paymentMethod: "COD",
            shippingAddressID: 201,
        },
        {
            orderID: 3,
            userID: 3,
            status: "cancelled",
            paymentMethod: "CreditCard",
            shippingAddressID: 301,
        },
        {
            orderID: 4,
            userID: 1,
            status: "delivered",
            paymentMethod: "COD",
            shippingAddressID: 102,
        },
        {
            orderID: 5,
            userID: 2,
            status: "pending",
            paymentMethod: "CreditCard",
            shippingAddressID: 201,
        },
    ]);

    // Seed fake order for testing retrieve order (subTotal and finalTotal are not calculated)
    await Order.bulkCreate([
        {
            orderID: 6,
            userID: 1,
            status: "processing",
            paymentMethod: "COD",
            subTotal: 14000,
            finalTotal: 12000,
            shippingAddressID: 101,
            couponID: 1,
        },
        {
            orderID: 7,
            userID: 1,
            status: "processing",
            paymentMethod: "Momo",
            subTotal: 10000,
            finalTotal: 8000,
            shippingAddressID: 101,
            couponID: 3,
        },
        {
            orderID: 8,
            userID: 1,
            status: "cancelled",
            paymentMethod: "Momo",
            subTotal: 15000,
            finalTotal: 15000,
            shippingAddressID: 101,
            couponID: 5,
        },
        {
            orderID: 9,
            userID: 1,
            status: "delivered",
            paymentMethod: "CreditCard",
            subTotal: 20000,
            finalTotal: 16000,
            shippingAddressID: 102,
            couponID: 5,
            deletedAt: new Date("2024-06-01"),
        },
        {
            orderID: 10,
            userID: 1,
            status: "delivered",
            paymentMethod: "CreditCard",
            subTotal: 20000,
            finalTotal: 18000,
            shippingAddressID: 102,
            couponID: 3,
        },
        {
            orderID: 11,
            userID: 2,
            status: "processing",
            paymentMethod: "COD",
            subTotal: 8000,
            finalTotal: 7000,
            shippingAddressID: 201,
            couponID: 2,
        },
        {
            orderID: 12,
            userID: 3,
            status: "processing",
            paymentMethod: "CreditCard",
            subTotal: 9000,
            finalTotal: 8000,
            shippingAddressID: 301,
            couponID: 3,
            deletedAt: new Date("2024-06-01"),
        },
        {
            orderID: 13,
            userID: 1,
            status: "cancelled",
            paymentMethod: "COD",
            subTotal: 10000,
            finalTotal: 9000,
            shippingAddressID: 102,
            couponID: 4,
        },
        {
            orderID: 14,
            userID: 2,
            status: "delivered",
            paymentMethod: "CreditCard",
            subTotal: 11000,
            finalTotal: 10000,
            shippingAddressID: 201,
            couponID: 5,
        },
        {
            orderID: 15,
            userID: 3,
            status: "delivered",
            paymentMethod: "COD",
            subTotal: 12000,
            finalTotal: 11000,
            shippingAddressID: 301,
            couponID: 6,
        },
        {
            orderID: 16,
            userID: 1,
            status: "processing",
            paymentMethod: "COD",
            subTotal: 13000,
            finalTotal: 12000,
            shippingAddressID: 101,
            couponID: 7,
        },
        {
            orderID: 17,
            userID: 2,
            status: "processing",
            paymentMethod: "CreditCard",
            subTotal: 14000,
            finalTotal: 13000,
            shippingAddressID: 201,
            couponID: 8,
        },
        {
            orderID: 18,
            userID: 3,
            status: "cancelled",
            paymentMethod: "COD",
            subTotal: 15000,
            finalTotal: 14000,
            shippingAddressID: 301,
            couponID: 9,
        },
        {
            orderID: 19,
            userID: 1,
            status: "delivered",
            paymentMethod: "CreditCard",
            subTotal: 16000,
            finalTotal: 15000,
            shippingAddressID: 102,
            couponID: 10,
        },
        {
            orderID: 20,
            userID: 1,
            status: "awaiting payment",
            paymentMethod: "COD",
            subTotal: 17000,
            finalTotal: 16000,
            shippingAddressID: 201,
            couponID: 1,
        },
    ]);
};

const seedOrderItem = async () => {
    await OrderItem.bulkCreate([
        {
            orderID: 1,
            variantID: 101,
            quantity: 1,
            priceAtPurchase: 0,
        },
        {
            orderID: 1,
            variantID: 201,
            quantity: 2,
            priceAtPurchase: 0,
        },
        {
            orderID: 1,
            variantID: 102,
            quantity: 1,
            priceAtPurchase: 0,
        },
        {
            orderID: 2,
            variantID: 301,
            quantity: 1,
            priceAtPurchase: 0,
        },
        {
            orderID: 2,
            variantID: 201,
            quantity: 2,
            priceAtPurchase: 0,
        },
        {
            orderID: 3,
            variantID: 301,
            quantity: 3,
            priceAtPurchase: 0,
        },
        {
            orderID: 4,
            variantID: 402,
            quantity: 4,
            priceAtPurchase: 0,
        },
        {
            orderID: 4,
            variantID: 305,
            quantity: 1,
            priceAtPurchase: 0,
        },
        {
            orderID: 4,
            variantID: 501,
            quantity: 5,
            priceAtPurchase: 0,
        },
        {
            orderID: 4,
            variantID: 104,
            quantity: 1,
            priceAtPurchase: 0,
        },
        {
            orderID: 4,
            variantID: 606,
            quantity: 2,
            priceAtPurchase: 0,
        },
        {
            orderID: 5,
            variantID: 501,
            quantity: 5,
            priceAtPurchase: 0,
        },
    ]);

    const orders = await Order.findAll({
        where: { orderID: ["1", "2", "3", "4", "5"] },
    });
    for (const order of orders) {
        const orderItems = await OrderItem.findAll({
            where: { orderID: order.orderID },
        });
        let subTotal = 0;
        for (const orderItem of orderItems) {
            const variant = await Variant.findByPk(orderItem.variantID);
            subTotal += variant.price * orderItem.quantity;

            await orderItem.update({
                priceAtPurchase: variant.price,
                discountPriceAtPurchase: variant.discountPrice,
            });
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

const seedOrderItem2 = async () => {
    await OrderItem.bulkCreate([
        {
            orderID: 6,
            variantID: 101,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 6,
            variantID: 102,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 6,
            variantID: 103,
            quantity: 1,
            priceAtPurchase: 1500,
            discountPriceAtPurchase: 1200,
        },
        {
            orderID: 7,
            variantID: 104,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 7,
            variantID: 105,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 7,
            variantID: 106,
            quantity: 1,
            priceAtPurchase: 1500,
            discountPriceAtPurchase: 1200,
        },
        {
            orderID: 8,
            variantID: 107,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 8,
            variantID: 108,
            quantity: 1,
            priceAtPurchase: 1000,
            discountPriceAtPurchase: 800,
        },
        {
            orderID: 8,
            variantID: 109,
            quantity: 1,
            priceAtPurchase: 1500,
            discountPriceAtPurchase: 1200,
        },
        {
            orderID: 9,
            variantID: 201,
            quantity: 1,
            priceAtPurchase: 2000,
        },
        {
            orderID: 9,
            variantID: 202,
            quantity: 1,
            priceAtPurchase: 2000,
        },
        {
            orderID: 9,
            variantID: 203,
            quantity: 1,
            priceAtPurchase: 2000,
        },
        {
            orderID: 10,
            variantID: 301,
            quantity: 1,
            priceAtPurchase: 3000,
        },
        {
            orderID: 10,
            variantID: 302,
            quantity: 1,
            priceAtPurchase: 3000,
        },
        {
            orderID: 10,
            variantID: 303,
            quantity: 1,
            priceAtPurchase: 3000,
        },
        {
            orderID: 11,
            variantID: 401,
            quantity: 1,
            priceAtPurchase: 4000,
        },
        {
            orderID: 11,
            variantID: 402,
            quantity: 1,
            priceAtPurchase: 4000,
        },
        {
            orderID: 11,
            variantID: 403,
            quantity: 1,
            priceAtPurchase: 4000,
        },
        {
            orderID: 12,
            variantID: 501,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 12,
            variantID: 502,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 12,
            variantID: 503,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 13,
            variantID: 504,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 13,
            variantID: 505,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 13,
            variantID: 506,
            quantity: 1,
            priceAtPurchase: 7000,
        },
        {
            orderID: 14,
            variantID: 507,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 14,
            variantID: 508,
            quantity: 1,
            priceAtPurchase: 6000,
        },
        {
            orderID: 14,
            variantID: 509,
            quantity: 1,
            priceAtPurchase: 7000,
        },
        {
            orderID: 15,
            variantID: 601,
            quantity: 1,
            priceAtPurchase: 2000,
        },
        {
            orderID: 15,
            variantID: 602,
            quantity: 1,
            priceAtPurchase: 2000,
        },
    ]);
};
