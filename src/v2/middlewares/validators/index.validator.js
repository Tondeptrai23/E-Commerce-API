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

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
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

    validateAddCategoriesForProduct:
        categoryValidator.validateAddCategoriesForProduct,

    validateCreateVariants: variantValidator.validateCreateVariants,
    validatePutVariant: variantValidator.validatePutVariant,
    validatePatchVariant: variantValidator.validatePatchVariant,

    validateCreateImages: imageValidator.validateCreateImages,
    validatePatchImage: imageValidator.validatePatchImage,
    validateReorderImages: imageValidator.validateReorderImages,

    validatePostOrder: orderValidator.validatePostOrder,
    validatePatchOrder: orderValidator.validatePatchOrder,
    validateApplyCoupon: orderValidator.validateApplyCoupon,

    validateAddToCart: cartValidator.validateAddToCart,
    validateUpdateCart: cartValidator.validateUpdateCart,
    validateFetchCart: cartValidator.validateFetchCart,

    validateCreateCoupon: couponValidator.validateCreateCoupon,
    validatePutCoupon: couponValidator.validatePutCoupon,
    validatePatchCoupon: couponValidator.validatePatchCoupon,
};

export default validator;
