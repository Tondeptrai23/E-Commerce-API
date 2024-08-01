import { toArray } from "../../utils/utils.js";
import { Op, Sequelize } from "sequelize";
import Category from "../../models/products/category.model.js";
import Product from "../../models/products/product.model.js";
import Coupon from "../../models/shopping/coupon.model.js";
import Order from "../../models/shopping/order.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import productCategoryService from "../products/productCategory.service.js";
import { flattenArray } from "../../utils/utils.js";
import Variant from "../../models/products/variant.model.js";
import FilterBuilder from "../condition/filterBuilder.service.js";
import categoryService from "../products/category.service.js";
import CouponSortBuilder from "../condition/couponSortBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import { db } from "../../models/index.model.js";

class CouponService {
    /**
     * Create a coupon
     *
     * @param {Object} couponData The coupon data to be created
     * @returns {Promise<Coupon>} The created coupon
     */
    async createCoupon(couponData) {
        const coupon = await Coupon.create(couponData);

        if (couponData.categories) {
            const categories = await Category.findAll({
                where: {
                    name: {
                        [Op.in]: couponData.categories,
                    },
                },
            });
            await coupon.setCategories(categories);
            coupon.dataValues.categories = categories;
        }

        if (couponData.products) {
            const products = await Product.findAll({
                where: {
                    productID: {
                        [Op.in]: couponData.products,
                    },
                },
            });
            await coupon.setProducts(products);
            coupon.dataValues.products = products;
        }

        return coupon;
    }

    /**
     * Build conditions for the query
     *
     * @param {Object} query The query to build conditions for
     * @returns {Object} The conditions
     */
    async #buildCondition(query) {
        const paginationCondition = new PaginationBuilder(query).build();

        if (!query) {
            return {
                couponFilter: [],
                productFilter: [],
                categoryFilter: [],
                sortingCondition: [],
                paginationCondition,
            };
        }

        const couponFilter = new FilterBuilder(query, "coupon").build();

        const productFilter = new FilterBuilder(
            query.product,
            "product"
        ).build();

        const categoryFilter = flattenArray(
            await Promise.all(
                toArray(query.category).map(async (category) => {
                    return (
                        await categoryService.getDescendantCategoriesByName(
                            category
                        )
                    ).map((category) => category.name);
                })
            )
        );

        const sortingCondition = new CouponSortBuilder(query).build();

        return {
            couponFilter,
            productFilter,
            categoryFilter,
            sortingCondition,
            paginationCondition,
        };
    }

    /**
     * Get product IDs based on the product filter
     *
     * @param {Object[]} productFilter The product filter
     * @returns {Promise<String[]>} The list of product IDs
     */
    async #getProductIDs(productFilter) {
        if (productFilter.length === 0) {
            return null;
        }

        const productIDs = (
            await Product.findAll({
                where: [...productFilter],
                attributes: ["productID"],
            })
        ).map((product) => product.productID);
        return productIDs;
    }

    /**
     * Find satisfied coupon IDs based on the conditions
     *
     * @param {Object[]} couponFilter The coupon filter
     * @param {Object} promotionCondition The promotion condition
     * @returns {Promise<Object>} The count and list of satisfied coupon IDs
     */
    async #findSatisfiedIDs(
        couponFilter = [],
        paginationCondition = {},
        promotionCondition = {}
    ) {
        const { count, rows } = await Coupon.findAndCountAll({
            distinct: true,
            attributes: [
                [db.literal("DISTINCT `coupon`.`couponID`"), "couponID"],
            ],
            where: [
                ...couponFilter,
                Object.keys(promotionCondition).length > 0
                    ? {
                          [Op.or]: promotionCondition,
                      }
                    : {},
            ],
            include: [
                {
                    model: Product,
                    as: "products",
                    attributes: [],
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: Category,
                    as: "categories",
                    through: {
                        attributes: [],
                    },
                    attributes: [],
                },
            ],
            ...paginationCondition,
            subQuery: false,
            raw: true,
        });

        const satisfiedIDs = rows.map((row) => row.couponID);

        return { count, satisfiedIDs };
    }

    /**
     * Fetch detailed information of coupons by satisfied IDs
     *
     * @param {Object[]} sortingCondition The sorting condition
     * @param {Object[]} satisfiedIDs The satisfied IDs
     * @returns {Promise<Object>} The list of coupons and pagination info
     */
    async #fetchDetailedCoupons(sortingCondition = [], satisfiedIDs = []) {
        const coupons = await Coupon.findAll({
            where: {
                couponID: satisfiedIDs,
            },
            include: [
                {
                    model: Product,
                    as: "products",
                    through: {
                        attributes: [],
                    },
                    attributes: ["productID", "name"],
                },
                {
                    model: Category,
                    as: "categories",
                    through: {
                        attributes: [],
                    },
                    attributes: ["name"],
                },
            ],
            order: sortingCondition,
        });

        return coupons;
    }

    /**
     * Get all coupons by query
     *
     * @param {Object} query The query to get
     * @returns {Promise<Object>} The list of coupons and pagination info
     */
    async getCoupons(query) {
        const conditions = await this.#buildCondition(query);

        const productIDs = await this.#getProductIDs(conditions.productFilter);

        const promotionCondition = {};
        if (productIDs) {
            promotionCondition["$products.productID$"] = productIDs;
        }
        if (conditions.categoryFilter.length > 0) {
            promotionCondition["$categories.name$"] = conditions.categoryFilter;
        }

        const { count, satisfiedIDs } = await this.#findSatisfiedIDs(
            conditions.couponFilter,
            conditions.paginationCondition,
            promotionCondition
        );

        const coupons = await this.#fetchDetailedCoupons(
            conditions.sortingCondition,
            satisfiedIDs
        );

        return {
            currentPage:
                conditions.paginationCondition.offset /
                    conditions.paginationCondition.limit +
                1,
            totalPages: Math.ceil(count / conditions.paginationCondition.limit),
            totalItems: count,
            coupons,
        };
    }

    /**
     * Get a coupon by id
     *
     * @param {String} couponID The id of the coupon to be retrieved
     * @param {Object} options The options to get the coupon
     * @param {Boolean} options.includeAssociated Include associated models
     *
     * @returns {Promise<Coupon>} The coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async getCoupon(couponID) {
        const coupon = await Coupon.findByPk(couponID, {
            include: [
                {
                    model: Product,
                    as: "products",
                    through: {
                        attributes: [],
                    },
                    attributes: ["productID", "name"],
                },
                {
                    model: Category,
                    as: "categories",
                    through: {
                        attributes: [],
                    },
                    attributes: ["name"],
                },
            ],
        });

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        return coupon;
    }

    /**
     * Update a coupon
     *
     * @param {String} couponID The id of the coupon to be updated
     * @param {Object} couponData The updated coupon data
     * @returns {Promise<Coupon>} The updated coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async updateCoupon(couponID, couponData) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        return await coupon.update(couponData);
    }

    /**
     * Delete a coupon
     *
     * @param {String} couponID The id of the coupon to be deleted
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async deleteCoupon(couponID) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        await coupon.destroy();
    }

    /**
     * Calculate final total based on coupon
     *
     * @param {Order} order - The order.
     * @param {Coupon} coupon - The coupon.
     * @returns {Number} - The final total.
     */
    async calcFinalTotal(order, coupon) {
        if (!order) {
            return 0;
        }
        if (!coupon) {
            return order.subTotal;
        }

        let totalAmount = order.subTotal;

        if (coupon.target === "all") {
            // Calculate the total amount
            switch (coupon.discountType) {
                case "percentage":
                    totalAmount -= (coupon.discountValue / 100) * totalAmount;
                    break;
                case "fixed":
                    totalAmount -= coupon.discountValue;
                    break;
            }
        } else if (coupon.target === "single") {
            if (!order.products) {
                order = await Order.findByPk(order.orderID, {
                    include: {
                        model: Variant,
                        as: "products",
                    },
                });
            }
            const products = order.products;
            const supportCategories = coupon.categories;

            // Get all products that are supported by the coupon
            // This includes products that are directly supported by the coupon
            // and products that are in categories supported by the coupon
            if (!coupon.products || !coupon.products.length) {
                coupon.products = [];
            }

            const supportProducts = flattenArray(
                coupon.products.concat(
                    await Promise.all(
                        supportCategories.map(async (category) => {
                            return await productCategoryService.getProductsByAncestorCategory(
                                category.name
                            );
                        })
                    )
                )
            ).map((product) => product.productID);

            // Calculate the total amount
            for (const product of products) {
                if (supportProducts.includes(product.productID)) {
                    let price = product.discountPrice ?? product.price;

                    switch (coupon.discountType) {
                        case "percentage":
                            totalAmount -=
                                (coupon.discountValue / 100) *
                                price *
                                product.orderItem.quantity;
                            break;
                        case "fixed":
                            totalAmount -=
                                coupon.discountValue *
                                product.orderItem.quantity;
                            break;
                    }
                }
            }
        }

        return totalAmount;
    }

    /**
     * Apply a coupon to the order
     *
     * @param {String} couponCode The code of the coupon to be applied
     * @param {Order} order The order to apply the coupon to
     * @returns {Promise<Order>} The updated order
     * @throws {ResourceNotFoundError} If the coupon is not found or not available
     */
    async applyCoupon(order, couponCode) {
        const coupon = await Coupon.findOne({
            where: {
                code: couponCode,
                ...getAvailableOptions(),
            },
            include: getIncludeOptions(),
        });
        if (!coupon) {
            throw new ResourceNotFoundError(
                "Coupon not found or not available"
            );
        }

        // Calculate final total
        order.finalTotal = await this.calcFinalTotal(order, coupon);

        // Update order
        if (order.couponID) {
            await Coupon.update(
                { timesUsed: Sequelize.literal("timesUsed - 1") },
                {
                    where: {
                        couponID: order.couponID,
                    },
                }
            );
        }
        order.couponID = coupon.couponID;
        await coupon.increment("timesUsed");

        return await order.save();
    }

    /**
     * Get recommended coupons for the order
     *
     * @param {Order} order The order to get recommended coupons for
     * @returns {Promise<Coupon[]>} The list of recommended coupons
     */
    async getRecommendedCoupons(order) {
        // Products in order
        const products = order.products
            ? [...new Set(order.products.map((product) => product.productID))]
            : [];

        // Categories that contain products in the order

        const categories = flattenArray(
            await Promise.all(
                products.map(async (productID) => {
                    return productCategoryService.getProductCategoryTree(
                        productID
                    );
                })
            )
        );
        const coupons = await Coupon.findAll({
            where: {
                ...getAvailableOptions(),
                // minimumOrderAmount <= subTotal
                minimumOrderAmount: {
                    [Op.lte]: order.subTotal,
                },
            },
            include: getIncludeOptions(),
            subQuery: false,
            where: {
                [Op.or]: [
                    {
                        "$products.productID$": {
                            [Op.in]: products,
                        },
                    },
                    {
                        "$categories.name$": {
                            [Op.in]: categories,
                        },
                    },
                ],
            },
        });

        return await Promise.all(
            coupons.map(async (coupon) => {
                return {
                    coupon: coupon,
                    subTotal: order.subTotal,
                    finalTotal: await this.calcFinalTotal(order, coupon),
                };
            })
        );
    }
}

const getAvailableOptions = () => {
    return (
        {
            [Op.or]: {
                // maxUsage > timesUsed
                timesUsed: {
                    [Op.lt]: Sequelize.col("maxUsage"),
                },
                maxUsage: {
                    [Op.is]: null,
                },
            },
        },
        {
            // endDate > today
            endDate: {
                [Op.or]: {
                    [Op.gt]: new Date().setHours(0, 0, 0, 0),
                    [Op.is]: null,
                },
            },
        }
    );
};

const getIncludeOptions = () => {
    return [
        {
            model: Product,
            as: "products",
        },
        {
            model: Category,
            as: "categories",
        },
    ];
};

export default new CouponService();
