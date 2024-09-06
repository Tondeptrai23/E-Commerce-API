import { toArray } from "../../utils/utils.js";
import { Op, Sequelize, Model, OptimisticLockError } from "sequelize";
import Category from "../../models/products/category.model.js";
import Product from "../../models/products/product.model.js";
import Coupon from "../../models/shopping/coupon.model.js";
import Order from "../../models/shopping/order.model.js";
import {
    ConflictError,
    ResourceNotFoundError,
    BadRequestError,
} from "../../utils/error.js";
import productCategoryService from "../products/productCategory.service.js";
import { flattenArray } from "../../utils/utils.js";
import Variant from "../../models/products/variant.model.js";
import CouponFilterBuilder from "../condition/filter/couponFilterBuilder.service.js";
import categoryService from "../products/category.service.js";
import CouponSortBuilder from "../condition/sort/couponSortBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import { db } from "../../models/index.model.js";
import ProductCoupon from "../../models/shopping/productCoupon.model.js";
import CategoryCoupon from "../../models/shopping/categoryCoupon.model.js";
import ProductFilterBuilder from "../condition/filter/productFilterBuilder.service.js";

class CouponService {
    /**
     * Create a coupon
     *
     * @param {Object} couponData The coupon data to be created
     * @returns {Promise<Coupon>} The created coupon
     * @throws {ConflictError} If the coupon code already exists
     */
    async createCoupon(couponData) {
        if (await this.isCouponExists(couponData.code)) {
            throw new ConflictError("Coupon code already exists");
        }

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
            coupon.categories = categories;
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
            coupon.products = products;
        }

        return coupon;
    }

    /**
     * Check if a coupon exists
     *
     * @param {String} code The code of the coupon to check
     * @returns {Promise<Boolean>} True if the coupon exists, false otherwise
     */
    async isCouponExists(code) {
        const coupon = await Coupon.findOne({
            where: {
                code,
            },
        });

        return coupon ? true : false;
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
        conditions.promotionCondition = promotionCondition;

        const CTE = this.#getCTEtoFilterCoupons(conditions);

        const { count, satisfiedIDs } = await this.#findSatisfiedIDs(
            conditions.paginationCondition,
            CTE
        );

        const coupons = await this.#fetchDetailedCoupons(satisfiedIDs);

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
            include: getIncludeOptions(),
        });

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        return coupon;
    }

    /**
     * Update a coupon
     * `maxUsage` is set to 0 to disable the coupon, or null to be used unlimited times
     *
     * @param {String} couponID The id of the coupon to be updated
     * @param {Object} couponData The updated coupon data
     * @returns {Promise<Coupon>} The updated coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     * @throws {BadRequestError} If the start date is after the end date or the minimum order amount is invalid
     */
    async updateCoupon(couponID, couponData) {
        let coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        coupon = coupon.set(couponData);

        if (coupon.startDate > coupon.endDate) {
            throw new BadRequestError("Start date should be before end date");
        }

        if (
            coupon.discountType === "percentage" &&
            coupon.minimumOrderAmount > 100
        ) {
            throw new BadRequestError(
                "Minimum order amount should be less than 100 for percentage discount"
            );
        }

        return await coupon.save();
    }

    /**
     * Disable a coupon by setting maxUsage to 0
     * This will prevent the coupon from being used
     *
     * @param {String} couponID The id of the coupon to be disabled
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async disableCoupon(couponID) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        await coupon.update({
            maxUsage: 0,
        });
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
                    let price =
                        product.orderItem.discountPriceAtPurchase ??
                        product.orderItem.priceAtPurchase;

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
        return await db
            .transaction(async (t) => {
                // If the order already has the same coupon, do nothing
                if (order.couponID === coupon.couponID) {
                    return order;
                }

                // If the order already has a different coupon, decrement the timesUsed
                // of the old coupon and increment the timesUsed of the new coupon
                if (order.couponID) {
                    const oldCoupon = await Coupon.findByPk(order.couponID);

                    const temp = await Coupon.update(
                        {
                            timesUsed: Sequelize.literal("timesUsed - 1"),
                            version: Sequelize.literal("version + 1"),
                        },
                        {
                            where: {
                                couponID: oldCoupon.couponID,
                                version: oldCoupon.version,
                            },
                        }
                    );

                    if (temp[0] === 0) {
                        throw new OptimisticLockError();
                    }
                }

                const affectedCount = await Coupon.update(
                    {
                        timesUsed: Sequelize.literal("timesUsed + 1"),
                        version: Sequelize.literal("version + 1"),
                    },
                    {
                        where: {
                            couponID: coupon.couponID,
                            maxUsage: {
                                [Op.or]: {
                                    [Op.gt]: Sequelize.col("timesUsed"),
                                    [Op.is]: null,
                                },
                            },
                            version: coupon.version,
                        },
                    }
                );

                if (affectedCount[0] === 0) {
                    throw new OptimisticLockError();
                }

                // Update the order with the new coupon
                const finalTotal = await this.calcFinalTotal(order, coupon);
                await order.update({
                    couponID: coupon.couponID,
                    finalTotal,
                });

                return await order.reload();
            })
            .catch((error) => {
                throw error;
            });
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

    /**
     * Add categories to a coupon
     *
     * @param {String} couponID The id of the coupon to add categories to
     * @param {String[]} categories The categories to add
     * @returns {Promise<Coupon>} The updated coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async addCategoriesToCoupon(couponID, categories) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        const foundCategories = await Category.findAll({
            where: {
                name: {
                    [Op.in]: categories,
                },
            },
        });

        await coupon.setCategories(foundCategories);

        return await Coupon.findByPk(couponID, {
            include: [
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
    }

    /**
     * Add products to a coupon
     *
     * @param {String} couponID The id of the coupon to add products to
     * @param {String[]} productIDs The products to add
     * @returns {Promise<Coupon>} The updated coupon
     */
    async addProductsToCoupon(couponID, productIDs) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        const foundProducts = await Product.findAll({
            where: {
                productID: {
                    [Op.in]: productIDs,
                },
            },
        });

        await coupon.setProducts(foundProducts);

        return await Coupon.findByPk(couponID, {
            include: [
                {
                    model: Product,
                    as: "products",
                    through: {
                        attributes: [],
                    },
                    attributes: ["productID", "name"],
                },
            ],
        });
    }

    /**
     * Delete a product from a coupon
     *
     * @param {String} couponID The id of the coupon to delete the product from
     * @param {String} productID The id of the product to delete
     * @returns {Promise<void>} The promise
     * @throws {ResourceNotFoundError} If the coupon is not found or the product is not found
     */
    async deleteProductFromCoupon(couponID, productID) {
        const coupon = await Coupon.findByPk(couponID, {
            include: {
                required: false,
                model: Product,
                as: "products",
                through: {
                    attributes: [],
                },
                attributes: ["productID"],
                where: {
                    productID: productID,
                },
            },
        });

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        if (!coupon.products || coupon.products.length === 0) {
            throw new ResourceNotFoundError("Product not found");
        }

        await ProductCoupon.destroy({
            where: {
                couponID: couponID,
                productID: productID,
            },
        });
    }

    /**
     * Delete a category from a coupon
     *
     * @param {String} couponID the id of the coupon to delete the category from
     * @param {String} categoryName  the name of the category to delete
     * @returns {Promise<void>} The promise
     * @throws {ResourceNotFoundError} If the coupon is not found or the category is not found
     */
    async deleteCategoryFromCoupon(couponID, categoryName) {
        const coupon = await Coupon.findByPk(couponID, {
            include: {
                required: false,
                model: Category,
                as: "categories",
                through: {
                    attributes: [],
                },
                attributes: ["categoryID"],
                where: {
                    name: categoryName,
                },
            },
        });

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        if (!coupon.categories || coupon.categories.length === 0) {
            throw new ResourceNotFoundError("Category not found");
        }

        await CategoryCoupon.destroy({
            where: {
                couponID: couponID,
                categoryID: coupon.categories[0].categoryID,
            },
        });
    }

    /**
     *
     *
     * The following methods are private methods that are used in getCoupons
     *
     *
     *
     */

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

        const couponFilter = new CouponFilterBuilder(query).build();
        const productFilter = new ProductFilterBuilder(query.product).build();

        const categoryFilter = flattenArray(
            await Promise.all(
                toArray(query.category).map(async (category) => {
                    return (
                        await categoryService.getDescendantCategories(category)
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
     * Get the CTE to filter coupons based on the conditions
     * Used internally by the getCoupons method
     *
     * Use queryInterface to generate the raw SQL query from the sequelize options
     * Because sequelize does not support CTE
     *
     * @param {Object} condtitions The conditions to filter coupons
     * @returns {String} The CTE to filter coupons
     */
    #getCTEtoFilterCoupons(condtitions) {
        const options = {
            attributes: [
                "couponID",
                [
                    db.literal(
                        "ROW_NUMBER() OVER(PARTITION BY `coupon`.`couponID`)"
                    ),
                    "rowNumber",
                ],
            ],
            where: [
                ...condtitions.couponFilter,
                Object.keys(condtitions.promotionCondition).length > 0
                    ? {
                          [Op.or]: condtitions.promotionCondition,
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
            order: [...condtitions.sortingCondition],
        };

        Model._validateIncludedElements.bind(Coupon)(options);
        const cte = db
            .getQueryInterface()
            .queryGenerator.selectQuery("coupons", options, Coupon)
            .slice(0, -1);

        return cte;
    }

    /**
     * Find satisfied coupon IDs based on the conditions
     *
     * @param {Object} paginationCondition The pagination condition
     * @param {String} CTE The CTE to filter coupons
     * @returns {Promise<count: Number, satisfiedIDs: String[]>} The count and satisfied IDs
     */
    async #findSatisfiedIDs(paginationCondition, CTE) {
        const count = (
            await db.query(
                `WITH CTE AS (${CTE}) 
            SELECT COUNT(DISTINCT couponID) AS count 
            FROM CTE`,
                {
                    type: db.QueryTypes.SELECT,
                    plain: true,
                }
            )
        ).count;

        const couponIDs = await db.query(
            `WITH CTE AS (${CTE}) 
            SELECT couponID 
            FROM CTE
            WHERE rowNumber = 1
            LIMIT ${paginationCondition.limit}
            OFFSET ${paginationCondition.offset}`.trim(),
            {
                type: db.QueryTypes.SELECT,
            }
        );

        return {
            count: count,
            satisfiedIDs: couponIDs.map((coupon) => coupon.couponID),
        };
    }

    /**
     * Fetch detailed information of coupons by satisfied IDs
     *
     * @param {Object[]} sortingCondition The sorting condition
     * @param {Object[]} satisfiedIDs The satisfied IDs
     * @returns {Promise<Object>} The list of coupons and pagination info
     */
    async #fetchDetailedCoupons(satisfiedIDs = []) {
        const coupons = await Coupon.findAll({
            where: {
                couponID: satisfiedIDs,
            },
            include: getIncludeOptions(),
        });

        // Sort the coupons based on the satisfied IDs
        const sortedCoupons = satisfiedIDs.map((couponID) =>
            coupons.find((coupon) => coupon.couponID === couponID)
        );

        return sortedCoupons;
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
    ];
};

export default new CouponService();
