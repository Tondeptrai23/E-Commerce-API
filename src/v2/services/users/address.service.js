import { Op } from "sequelize";
import Address from "../../models/user/address.model.js";
import User from "../../models/user/user.model.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import ShippingAddress from "../../models/shopping/shippingAddress.model.js";

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
     *
     * @param {User} user
     * @param {String} addressID
     * @returns {Promise<Address>}
     * @throws {ResourceNotFoundError}
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
     *
     */
    async getAddresses(user) {
        const addresses = await Address.findAll({
            where: {
                userID: user.userID,
            },
        });

        return addresses;
    }

    /**
     * Update an address
     *
     * @param {User} user
     * @param {String} addressID
     * @param {Object} addressData
     * @returns {Promise<Address>}
     * @throws {ResourceNotFoundError}
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
        const address = await this.getAddressByID(user, addressID);

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
                throw ConflictError(
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
     * @param {User} user
     * @param {String} addressID
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
