import addressService from "../../services/users/address.service.js";
import AddressSerializer from "../../services/serializers/address.serializer.service.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import userService from "../../services/users/user.service.js";

class AddressController {
    async postAddress(req, res) {
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in creating address",
                    },
                ],
            });
        }
    }

    async getUserAddresses(req, res) {
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting addresses",
                    },
                ],
            });
        }
    }

    async getUserAddress(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting address",
                    },
                ],
            });
        }
    }

    async getUserAddressesAdmin(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting addresses",
                    },
                ],
            });
        }
    }

    async getUserAddressAdmin(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting address",
                    },
                ],
            });
        }
    }

    async getShippingAddress(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting shipping address",
                    },
                ],
            });
        }
    }

    async putAddress(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in updating address",
                    },
                ],
            });
        }
    }

    async deleteAddress(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            }

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in deleting address",
                    },
                ],
            });
        }
    }
}

export default new AddressController();
