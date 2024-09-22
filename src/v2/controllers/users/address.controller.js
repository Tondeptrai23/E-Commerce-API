import addressService from "../../services/users/address.service.js";
import AddressSerializer from "../../services/serializers/address.seralizer.service.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";

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
            const serializedAddress = AddressSerializer.serialize(address, {
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

            // Call services
            const addresses = await addressService.getAddresses(user);

            // Serialize data
            const serializedAddresses = AddressSerializer.serialize(addresses, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
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
            const serializedAddress = AddressSerializer.serialize(address, {
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
            const serializedAddress = AddressSerializer.serialize(address, {
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
