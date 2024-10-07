import addressService from "../../services/users/address.service.js";
import AddressSerializer from "../../services/serializers/address.serializer.service.js";
import { StatusCodes } from "http-status-codes";
import userService from "../../services/users/user.service.js";

class AddressController {
    async postAddress(req, res, next) {
        try {
            // Get params
            const user = req.user;
            const addressData = req.body;

            // Call services
            const address = await addressService.createAddress(
                user,
                addressData
            );

            // Serialize data
            const serializedAddress = AddressSerializer.parse(address, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                address: serializedAddress,
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserAddresses(req, res, next) {
        try {
            // Get params
            const user = req.user;
            const query = req.query;

            // Call services
            const { totalItems, totalPages, currentPage, addresses } =
                await addressService.getAddresses(user, query);

            // Serialize data
            const serializedAddresses = AddressSerializer.parse(addresses, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                totalItems: totalItems,
                totalPages: totalPages,
                currentPage: currentPage,
                addresses: serializedAddresses,
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserAddress(req, res, next) {
        try {
            // Get params
            const user = req.user;
            const { addressID } = req.params;

            // Call services
            const address = await addressService.getAddressByID(
                user,
                addressID
            );

            // Serialize data
            const serializedAddress = AddressSerializer.parse(address, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                address: serializedAddress,
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserAddressesAdmin(req, res, next) {
        try {
            // Get params
            const { userID } = req.params;
            const query = req.query;

            // Call services
            const user = await userService.getUser(userID);
            const { totalItems, totalPages, currentPage, addresses } =
                await addressService.getAddresses(user, query);

            // Serialize data
            const serializedAddresses = AddressSerializer.parse(addresses, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                totalItems: totalItems,
                totalPages: totalPages,
                currentPage: currentPage,
                addresses: serializedAddresses,
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserAddressAdmin(req, res, next) {
        try {
            // Get params
            const { userID, addressID } = req.params;

            // Call services
            const user = await userService.getUser(userID);
            const address = await addressService.getAddressByID(
                user,
                addressID
            );

            // Serialize data
            const serializedAddress = AddressSerializer.parse(address, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                address: serializedAddress,
            });
        } catch (err) {
            next(err);
        }
    }

    async getShippingAddress(req, res, next) {
        try {
            // Get params
            const { shippingAddressID } = req.params;

            // Call services
            const shippingAddress = await addressService.getShippingAddress(
                shippingAddressID
            );

            // Serialize data
            const serializedShippingAddress = AddressSerializer.parse(
                shippingAddress,
                {
                    detailAddress: true,
                }
            );

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                shippingAddress: serializedShippingAddress,
            });
        } catch (err) {
            next(err);
        }
    }

    async putAddress(req, res, next) {
        try {
            // Get params
            const user = req.user;
            const { addressID } = req.params;
            const addressData = req.body;

            // Call services
            const address = await addressService.updateAddress(
                user,
                addressID,
                addressData
            );

            // Serialize data
            const serializedAddress = AddressSerializer.parse(address, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                address: serializedAddress,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteAddress(req, res, next) {
        try {
            // Get params
            const user = req.user;
            const { addressID } = req.params;

            // Call services
            await addressService.deleteAddress(user, addressID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AddressController();
