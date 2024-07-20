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
import ShippingAddress from "./user/address.model.js";

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

Category.hasOne(Category, {
    foreignKey: {
        name: "parentID",
        allowNull: true,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "parent",
    sourceKey: "categoryID",
});

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

Product.belongsTo(Variant, {
    foreignKey: {
        name: "defaultVariantID",
        allowNull: true,
    },
    onDelete: "SET NULL",
    constraints: true,
    as: "defaultVariant",
});

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

User.hasMany(ShippingAddress, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "addresses",
});
ShippingAddress.belongsTo(User, {
    foreignKey: {
        name: "userID",
        allowNull: false,
    },
    onDelete: "CASCADE",
    constraints: true,
    as: "user",
});

export { sequelize as db };