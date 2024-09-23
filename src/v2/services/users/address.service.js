import { Op } from "sequelize";
import Address from "../../models/user/address.model.js";
import User from "../../models/user/user.model.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import ShippingAddress from "../../models/shopping/shippingAddress.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";

class AddressService {
    /**
     * Create a new address for the user
     *
     * @param {User} user user model instance
     * @param {Object} addressData address data
     * @returns {Promise<Address>} created address
     */
    async createAddress(user, addressData) {
        const existingDefaultAddress = await Address.findOne({
            where: {
                userID: user.userID,
                isDefault: true,
            },
        });

        if (!existingDefaultAddress) {
            addressData.isDefault = true;
        }

        const address = await Address.create({
            ...addressData,
            userID: user.userID,
        });

        return address;
    }

    /**
     * Create a shipping address based on the addressID
     *
     * @param {Object} addressData address data
     * @returns {Promise<ShippingAddress>} created shipping address
     */
    async createShippingAddress(addressData) {
        return await ShippingAddress.create({
            addressID: addressData.addressID,
            phoneNumber: addressData.phoneNumber,
            recipientName: addressData.recipientName,
            address: addressData.address,
            city: addressData.city,
            district: addressData.district,
        });
    }

    /**
     * Get an address by ID
     *
     * @param {User} user user model instance
     * @param {String} addressID address ID
     * @returns {Promise<Address>} address
     * @throws {ResourceNotFoundError} if address not found
     */
    async getAddressByID(user, addressID) {
        const address = await Address.findOne({
            where: {
                addressID,
                userID: user.userID,
            },
        });

        if (!address) {
            throw new ResourceNotFoundError("Address not found");
        }

        return address;
    }

    /**
     * Get all addresses of a user
     *
     * @param {User} user user model instance
     * @param {Object} query query parameters
     * @returns {Promise<Address[]>} list of addresses
     */
    async getAddresses(user, query) {
        const paginationConditions = new PaginationBuilder(query).build();

        const { count, rows: addresses } = await Address.findAndCountAll({
            where: {
                userID: user.userID,
            },
            ...paginationConditions,
            order: [["createdAt", "DESC"]],
        });

        return {
            currentPage:
                paginationConditions.offset / paginationConditions.limit + 1,
            totalPages: Math.ceil(count / paginationConditions.limit),
            totalItems: count,
            addresses: addresses,
        };
    }

    /**
     * Get shipping address
     *
     * @param {String} shippingAddressID shipping address ID
     * @returns {Promise<ShippingAddress>} shipping address
     */
    async getShippingAddress(shippingAddressID) {
        const address = await ShippingAddress.findOne({
            where: {
                shippingAddressID,
            },
        });

        if (!address) {
            throw new ResourceNotFoundError("Shipping address not found");
        }

        return address;
    }

    /**
     * Update an address
     *
     * @param {User} user user model instance
     * @param {String} addressID address ID to update
     * @param {Object} addressData address data to update
     * @returns {Promise<Address>} updated address
     * @throws {ResourceNotFoundError} if address not found
     */
    async updateAddress(
        user,
        addressID,
        addressData = {
            phoneNumber,
            recipientName,
            address,
            city,
            district,
            isDefault: false,
        }
    ) {
        let address = await this.getAddressByID(user, addressID);

        // Toggle default address to false
        if (address.isDefault && !addressData.isDefault) {
            const otherAddress = await Address.findOne({
                where: {
                    userID: user.userID,
                    addressID: {
                        [Op.ne]: addressID,
                    },
                },
            });

            if (!otherAddress) {
                throw new ConflictError(
                    "There is no other address to set as default"
                );
            }

            otherAddress.update({ isDefault: true });
        }
        // Toggle default address to true
        else if (!address.isDefault && addressData.isDefault) {
            Address.update(
                {
                    isDefault: false,
                },
                {
                    where: {
                        userID: user.userID,
                        isDefault: true,
                    },
                }
            );
        }

        address = await address.update(addressData);
        return address;
    }

    /**
     * Delete an address
     *
     * @param {User} user user model instance
     * @param {String} addressID address ID to delete
     */
    async deleteAddress(user, addressID) {
        const address = await this.getAddressByID(user, addressID);

        // If the address is default, set another address as default
        if (address.isDefault) {
            const otherAddress = await Address.findOne({
                where: {
                    userID: user.userID,
                    addressID: {
                        [Op.ne]: addressID,
                    },
                },
            });

            otherAddress.update({ isDefault: true });
        }

        await address.destroy();
    }
}
export default new AddressService();
