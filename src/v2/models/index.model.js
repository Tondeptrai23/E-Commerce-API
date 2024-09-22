import { sequelize } from "../config/database.config.js";

import Product from "./products/product.model.js";
import ProductImage from "./products/productImage.model.js";
import Category from "./products/category.model.js";
import ProductCategory from "./products/productCategory.model.js";
import Variant from "./products/variant.model.js";
import Attribute from "./products/attribute.model.js";
import VariantAttributeValue from "./products/variantAttributeValue.model.js";
import AttributeValue from "./products/attributeValue.model.js";

import Order from "./shopping/order.model.js";
import OrderItem from "./shopping/orderItem.model.js";
import User from "./user/user.model.js";
import CartItem from "./shopping/cartItem.model.js";

import Coupon from "./shopping/coupon.model.js";
import ProductCoupon from "./shopping/productCoupon.model.js";
import CategoryCoupon from "./shopping/categoryCoupon.model.js";
import ShippingAddress from "./shopping/shippingAddress.model.js";
import Address from "./user/address.model.js";

// Product - <1, n> - ProductImage
Product.hasMany(ProductImage, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "images",
});
ProductImage.belongsTo(Product, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "product",
});

// Variant - <1, 1> - ProductImage
Variant.belongsTo(ProductImage, {
    foreignKey: {
        name: "imageID",
        allowNull: true,
    },
    onDelete: "SET NULL",
    constraints: true,
    as: "image",
});

// User - <n, n> - Variant - through CartItem
User.belongsToMany(Variant, {
    through: CartItem,
    foreignKey: { name: "userID", allowNull: false },
    constraints: true,
    onDelete: "CASCADE",
    as: "cartItems",
});
Variant.belongsToMany(User, {
    through: CartItem,
    foreignKey: {
        name: "variantID",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
    as: "users",
});

// Product - <n, n> - Category - through ProductCategory
Category.belongsToMany(Product, {
    foreignKey: {
        name: "categoryID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "products",
    through: ProductCategory,
});
Product.belongsToMany(Category, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "categories",
    through: ProductCategory,
});

// Category - <1, 1> - Category
Category.belongsTo(Category, {
    foreignKey: {
        name: "parentID",
        allowNull: true,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "parent",
    sourceKey: "categoryID",
});

// Product - <n, n> - Coupon - through ProductCoupon
Product.belongsToMany(Coupon, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    through: ProductCoupon,
    constraints: true,
    onDelete: "CASCADE",
    as: "coupons",
});
Coupon.belongsToMany(Product, {
    foreignKey: {
        name: "couponID",
        allowNull: false,
    },
    through: ProductCoupon,
    constraints: true,
    onDelete: "CASCADE",
    as: "products",
});

// Category - <n, n> - Coupon - through CategoryCoupon
Category.belongsToMany(Coupon, {
    foreignKey: {
        name: "categoryID",
        allowNull: false,
    },
    through: CategoryCoupon,
    constraints: true,
    onDelete: "CASCADE",
    as: "coupons",
});
Coupon.belongsToMany(Category, {
    foreignKey: {
        name: "couponID",
        allowNull: false,
    },
    through: CategoryCoupon,
    constraints: true,
    onDelete: "CASCADE",
    as: "categories",
});

// User - <1, n> - Order
User.hasMany(Order, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "orders",
});
Order.belongsTo(User, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "user",
});

// ShippingAddress - <1, n> - Order
Order.belongsTo(ShippingAddress, {
    foreignKey: {
        name: "shippingAddressID",
        allowNull: true,
    },
    onDelete: "SET NULL",
    constraints: true,
    as: "shippingAddress",
});
ShippingAddress.hasMany(Order, {
    foreignKey: {
        name: "shippingAddressID",
        allowNull: true,
    },
    onDelete: "SET NULL",
    constraints: true,
    as: "orders",
});

// Order - <n, n> - Variant - through OrderItem
Order.belongsToMany(Variant, {
    foreignKey: {
        name: "orderID",
        allowNull: false,
    },
    through: OrderItem,
    constraints: true,
    onDelete: "CASCADE",
    as: "products",
});
Variant.belongsToMany(Order, {
    foreignKey: {
        name: "variantID",
        allowNull: false,
    },
    through: OrderItem,
    constraints: true,
    onDelete: "CASCADE",
    as: "orders",
});

// Coupon - <1, n> - Order
Order.belongsTo(Coupon, {
    foreignKey: {
        name: "couponID",
        allowNull: true,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "coupon",
});
Coupon.hasMany(Order, {
    foreignKey: {
        name: "couponID",
        allowNull: true,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "order",
});

// Product - <1, n> - Variant
Product.hasMany(Variant, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "variants",
});
Variant.belongsTo(Product, {
    foreignKey: {
        name: "productID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "product",
});

// Variant - <n, n> - AttributeValue - through VariantAttributeValue
Variant.belongsToMany(AttributeValue, {
    foreignKey: {
        name: "variantID",
        allowNull: false,
    },
    through: VariantAttributeValue,
    constraints: true,
    onDelete: "CASCADE",
    as: "attributeValues",
});
AttributeValue.belongsToMany(Variant, {
    foreignKey: {
        name: "valueID",
        allowNull: false,
    },
    through: VariantAttributeValue,
    constraints: true,
    onDelete: "CASCADE",
    as: "variants",
});

// Attribute - <1, n> - AttributeValue
Attribute.hasMany(AttributeValue, {
    foreignKey: {
        name: "attributeID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "values",
});
AttributeValue.belongsTo(Attribute, {
    foreignKey: {
        name: "attributeID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "attribute",
});

// User - <1, n> - Address
User.hasMany(Address, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "addresses",
});
Address.belongsTo(User, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "user",
});

export { sequelize as db };
