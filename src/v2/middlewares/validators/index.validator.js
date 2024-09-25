import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import * as userValidator from "./users/user.validator.js";
import * as productValidator from "./products/product.validator.js";
import * as categoryValidator from "./products/category.validator.js";
import * as variantValidator from "./products/variant.validator.js";
import * as imageValidator from "./products/image.validator.js";
import * as orderValidator from "./shopping/order.validator.js";
import * as cartValidator from "./shopping/cart.validator.js";
import * as couponValidator from "./shopping/coupon.validator.js";
import * as attributeValidator from "./products/attribute.validator.js";
import * as addressValidator from "./users/address.validator.js";
import { MulterError } from "multer";
import { imageConfig } from "../../config/config.js";

const handleValidationErrors = (req, res, next) => {
    let errors = validationResult(req);

    const errorsArray = errors.array().map((error) => {
        error.message = error.msg;
        delete error.msg;
        return error;
    });

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            errors: errorsArray,
        });
    }

    next();
};

const handleValidationFileUpload = (error, req, res, next) => {
    if (error instanceof MulterError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            errors: [
                {
                    type: "file",
                    location: "files",
                    path: error.field,
                    message: error.message,
                },
            ],
        });
    }

    next();
};

const validator = {
    handleValidationErrors,
    handleValidationFileUpload,

    // Auth
    validateRegisterUser: userValidator.validateRegisterUser,
    validateSignInUser: userValidator.validateSignInUser,

    // Address
    validateCreateAddress: addressValidator.validateCreateAddress,
    validatePutAddress: addressValidator.validatePutAddress,
    validateQueryAddressUser: addressValidator.validateQueryAddressUser,

    // Product
    validateCreateProduct: productValidator.validateCreateProduct,
    validatePatchProduct: productValidator.validatePatchProduct,
    validateQueryGetProduct: productValidator.validateQueryGetProduct,
    validateQueryGetProductUser: productValidator.validateQueryGetProductUser,

    // Category
    validateAddCategoriesForProduct:
        categoryValidator.validateAddCategoriesForProduct,
    validatePutCategoriesForProduct:
        categoryValidator.validatePutCategoriesForProduct,
    validateAddCategory: categoryValidator.validateAddCategory,
    validatePutCategory: categoryValidator.validatePutCategory,
    validateQueryGetCategory: categoryValidator.validateQueryGetCategoryAdmin,
    validateQueryGetCategoryUser:
        categoryValidator.validateQueryGetCategoryUser,

    // Variant
    validateCreateVariants: variantValidator.validateCreateVariants,
    validatePutVariant: variantValidator.validatePutVariant,
    validatePatchVariant: variantValidator.validatePatchVariant,
    validateQueryGetVariant: variantValidator.validateQueryGetVariant,

    // Image
    validateCreateImages: imageValidator.validateCreateImages,
    validateReorderImages: imageValidator.validateReorderImages,

    // Order
    validatePostOrder: orderValidator.validatePostOrder,
    validatePatchOrder: orderValidator.validatePatchOrder,
    validateApplyCoupon: orderValidator.validateApplyCoupon,
    validateQueryGetOrderUser: orderValidator.validateQueryGetOrderUser,
    validateQueryGetOrderAdmin: orderValidator.validateQueryGetOrderAdmin,

    // Cart
    validateAddToCart: cartValidator.validateAddToCart,
    validateUpdateCart: cartValidator.validateUpdateCart,
    validateFetchCart: cartValidator.validateFetchCart,
    validateQueryCart: cartValidator.validateQueryCart,

    // Coupon
    validateCreateCoupon: couponValidator.validateCreateCoupon,
    validatePatchCoupon: couponValidator.validatePatchCoupon,
    validateAddCategoriesCoupon: couponValidator.validateAddCategoriesCoupon,
    validateAddProductsCoupon: couponValidator.validateAddProductsCoupon,
    validateQueryGetCoupon: couponValidator.validateQueryGetCoupon,

    // Attribute
    validateQueryGetAttribute: attributeValidator.validateQueryGetAttribute,
    validateCreateAttribute: attributeValidator.validatePostAttribute,
    validatePatchAttribute: attributeValidator.validatePatchAttribute,

    // Attribute Value
    validateCreateAttributeValue: attributeValidator.validatePostAttributeValue,
    validateQueryGetAttributeValue:
        attributeValidator.validateQueryGetAttributeValue,
    validateQueryGetAttributeVariants:
        attributeValidator.validateQueryGetVariants,
};

export default validator;
