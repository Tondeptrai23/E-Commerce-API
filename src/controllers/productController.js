import { CartService } from "../services/cartService.js";
import { ProductAPIResponseSerializer } from "../utils/apiResponseSerializer.js";
import { ProductService } from "../services/productService.js";
import { ResourceNotFoundError } from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

class ProductController {
    static getProduct = async (req, res) => {
        try {
            const product = await ProductService.findOneByID(
                req.params.productId
            );

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }
            res.status(StatusCodes.OK).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(product),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: `Error in retrieving product`,
                });
            }
        }
    };

    static getAllProducts = async (req, res) => {
        try {
            const { products, quantity, totalPages, currentPage } =
                await ProductService.findAllProducts(req.query);

            res.status(StatusCodes.OK).json({
                success: true,
                products: products.map((product) => {
                    return ProductAPIResponseSerializer.serialize(product);
                }),
                totalProducts: quantity,
                totalPages: totalPages,
                currentPage: currentPage,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in retrieving products",
            });
        }
    };

    static addProductToCart = async (req, res) => {
        try {
            const product = await CartService.addProduct(
                req.user,
                req.params.productId
            );

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            res.status(StatusCodes.OK).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(product),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in adding product to cart",
                });
            }
        }
    };

    static createNewProduct = async (req, res) => {
        try {
            const newProduct = await ProductService.createOne({
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                price: Number(req.body.price),
            });

            res.status(StatusCodes.CREATED).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(newProduct),
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in creating product",
            });
        }
    };

    static updateProduct = async (req, res) => {
        try {
            const product = await ProductService.updateOneByID(
                req.params.productId,
                {
                    name: req.body.name,
                    description: req.body.description,
                    imageURL: req.body.imageURL,
                    price: Number(req.body.price),
                }
            );

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            res.status(StatusCodes.OK).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(product),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: "Error in updating product",
                });
            }
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const product = await ProductService.deleteOneByID(
                req.params.productId
            );

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            res.status(StatusCodes.OK).json({ success: true });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in deleting product",
                });
            }
        }
    };
}

export { ProductController };
