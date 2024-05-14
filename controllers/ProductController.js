import { CartService } from "../services/CartService.js";
import { ProductService } from "../services/ProductService.js";

class ProductController {
    static postProduct = async (req, res) => {
        try {
            const newProduct = await ProductService.createOne({
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                price: Number(req.body.price),
            });

            res.status(201).json({
                success: true,
                product: newProduct,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in creating product.",
            });
        }
    };

    static getProduct = async (req, res) => {
        try {
            const product = await ProductService.findOneByID(req.params.id);

            if (product === null) {
                res.status(404).json({
                    success: false,
                    error: "Product not found.",
                });
            } else {
                res.status(200).json({
                    success: true,
                    product: product,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: `Error in retrieving product.`,
            });
        }
    };

    static getAllProducts = async (req, res) => {
        try {
            const { products, quantity } = await ProductService.findAllProducts(
                req.query
            );

            res.status(200).json({
                quantity: quantity,
                success: true,
                products: products,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in retrieving products.",
            });
        }
    };

    static addProductToCart = async (req, res) => {
        try {
            const product = await CartService.addProduct(
                req.user,
                req.params.id
            );

            res.status(200).json({
                success: true,
                user: req.user,
                product: product,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in adding product to cart",
            });
        }
    };

    static updateProduct = async (req, res) => {
        try {
            const product = await ProductService.updateOneByID(req.params.id, {
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                price: Number(req.body.price),
            });

            if (product) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    error: "Product not found",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in updating product.",
            });
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const product = await ProductService.deleteOneByID(req.params.id);

            if (product) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    error: "Product not found",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in deleting product.",
            });
        }
    };
}

export { ProductController };
