import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import * as userValidator from "./user.validator.js";
import * as productValidator from "./products/product.validator.js";
import * as categoryValidator from "./products/category.validator.js";
import * as variantValidator from "./products/variant.validator.js";
import * as imageValidator from "./products/image.validator.js";
import * as orderValidator from "./shopping/order.validator.js";
import * as cartValidator from "./shopping/cart.validator.js";
import * as couponValidator from "./shopping/coupon.validator.js";
import * as attributeValidator from "./products/attribute.validator.js";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

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

const validator = {
    handleValidationErrors,

    validateRegisterUser: userValidator.validateRegisterUser,
    validateSignInUser: userValidator.validateSignInUser,

    validateCreateProduct: productValidator.validateCreateProduct,
    validatePatchProduct: productValidator.validatePatchProduct,
    validateQueryGetProduct: productValidator.validateQueryGetProduct,
    validateQueryGetProductUser: productValidator.validateQueryGetProductUser,

    validateAddCategoriesForProduct:
        categoryValidator.validateAddCategoriesForProduct,
    validatePutCategoriesForProduct:
        categoryValidator.validatePutCategoriesForProduct,
    validateAddCategory: categoryValidator.validateAddCategory,
    validatePutCategory: categoryValidator.validatePutCategory,
    validateQueryGetCategory: categoryValidator.validateQueryGetCategoryAdmin,
    validateQueryGetCategoryUser:
        categoryValidator.validateQueryGetCategoryUser,

    validateCreateVariants: variantValidator.validateCreateVariants,
    validatePutVariant: variantValidator.validatePutVariant,
    validatePatchVariant: variantValidator.validatePatchVariant,
    validateQueryGetVariant: variantValidator.validateQueryGetVariant,

    validateCreateImages: imageValidator.validateCreateImages,
    validatePatchImage: imageValidator.validatePatchImage,
    validateReorderImages: imageValidator.validateReorderImages,

    validatePostOrder: orderValidator.validatePostOrder,
    validatePatchOrder: orderValidator.validatePatchOrder,
    validateApplyCoupon: orderValidator.validateApplyCoupon,

    validateAddToCart: cartValidator.validateAddToCart,
    validateUpdateCart: cartValidator.validateUpdateCart,
    validateFetchCart: cartValidator.validateFetchCart,
    validateQueryCart: cartValidator.validateQueryCart,

    validateCreateCoupon: couponValidator.validateCreateCoupon,
    validatePatchCoupon: couponValidator.validatePatchCoupon,
    validateAddCategoriesCoupon: couponValidator.validateAddCategoriesCoupon,
    validateAddProductsCoupon: couponValidator.validateAddProductsCoupon,
    validateQueryGetCoupon: couponValidator.validateQueryGetCoupon,

    validateQueryGetAttribute: attributeValidator.validateQueryGetAttribute,
    validateCreateAttribute: attributeValidator.validatePostAttribute,
    validatePatchAttribute: attributeValidator.validatePatchAttribute,

    validateCreateAttributeValue: attributeValidator.validatePostAttributeValue,
    validateQueryGetAttributeValue:
        attributeValidator.validateQueryGetAttributeValue,
    validateQueryGetAttributeVariants:
        attributeValidator.validateQueryGetVariants,
};

export default validator;
