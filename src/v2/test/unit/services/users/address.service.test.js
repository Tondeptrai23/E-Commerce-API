import seedData from "../../../../seedData.js";
import addressService from "../../../../services/users/address.service.js";
import User from "../../../../models/user/user.model.js";
import {
    ConflictError,
    ResourceNotFoundError,
} from "../../../../utils/error.js";
import Address from "../../../../models/user/address.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("AddressService", () => {
    let user;
    let newUser;

    beforeAll(async () => {
        user = await User.findByPk(1);
        newUser = await User.create({
            email: "test@gmail.com",
            password: "password",
        });
    });

    describe("createAddress", () => {
        it("should create first address for the user", async () => {
            const addressData = {
                phoneNumber: "1234567890",
                recipientName: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                district: "AnyDistrict",
            };

            const address = await addressService.createAddress(
                newUser,
                addressData
            );

            expect(address).toHaveProperty("addressID");
            expect(address.userID).toBe(newUser.userID);
            expect(address.phoneNumber).toBe(addressData.phoneNumber);
            expect(address.isDefault).toBe(true);
        });

        it("should create a new address for the user", async () => {
            const addressData = {
                phoneNumber: "1234567890",
                recipientName: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                district: "AnyDistrict",
            };

            const address = await addressService.createAddress(
                newUser,
                addressData
            );

            expect(address).toHaveProperty("addressID");
            expect(address.userID).toBe(newUser.userID);
            expect(address.phoneNumber).toBe(addressData.phoneNumber);
            expect(address.isDefault).toBe(false);
        });
    });

    describe("createShippingAddress", () => {
        it("should create a new shipping address", async () => {
            const addressData = {
                addressID: 1,
                phoneNumber: "1234567890",
                recipientName: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                district: "AnyDistrict",
            };

            const shippingAddress = await addressService.createShippingAddress(
                addressData
            );

            expect(shippingAddress).toHaveProperty("shippingAddressID");
            expect(shippingAddress.shippingAddressID).not.toBe(
                addressData.addressID
            );
            expect(shippingAddress.phoneNumber).toBe(addressData.phoneNumber);
        });
    });

    describe("getAddressByID", () => {
        it("should return the address by ID", async () => {
            const address = await addressService.getAddressByID(user, "101");

            expect(address).toEqual(
                expect.objectContaining({
                    addressID: "101",
                    userID: user.userID,
                })
            );
        });

        it("should throw ResourceNotFoundError if address not found", async () => {
            await expect(
                addressService.getAddressByID(user, "999")
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getAddresses", () => {
        it("should return addresses for the user", async () => {
            const { addresses, currentPage, totalPages, totalItems } =
                await addressService.getAddresses(user, {
                    page: 1,
                    size: 1,
                });

            expect(addresses).toBeInstanceOf(Array);
            expect(addresses).toHaveLength(1);
            expect(currentPage).toBe(1);
            expect(totalPages).toBe(2);
            expect(totalItems).toBe(2);

            const { currentPage: currentPage2 } =
                await addressService.getAddresses(user, {
                    page: 2,
                    size: 1,
                });
            expect(currentPage2).toBe(2);
        });
    });

    describe("getShippingAddress", () => {
        it("should return the shipping address by ID", async () => {
            const shippingAddress = await addressService.createShippingAddress({
                phoneNumber: "1234567890",
                recipientName: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                district: "AnyDistrict",
            });

            const createdShippingAddress =
                await addressService.getShippingAddress(
                    shippingAddress.shippingAddressID
                );

            expect(createdShippingAddress).toEqual(
                expect.objectContaining({
                    shippingAddressID: shippingAddress.shippingAddressID,
                    phoneNumber: shippingAddress.phoneNumber,
                    recipientName: shippingAddress.recipientName,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    district: shippingAddress.district,
                })
            );
        });

        it("should throw ResourceNotFoundError if shipping address not found", async () => {
            await expect(
                addressService.getShippingAddress(999)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("updateAddress", () => {
        it("should update the address by addressID", async () => {
            const addressData = (
                await addressService.getAddressByID(user, "101")
            ).toJSON();

            addressData.phoneNumber = "8888888888";

            const address = await addressService.updateAddress(
                user,
                "101",
                addressData
            );

            expect(address).toEqual(
                expect.objectContaining({
                    addressID: "101",
                    phoneNumber: addressData.phoneNumber,
                    recipientName: addressData.recipientName,
                    address: addressData.address,
                    city: addressData.city,
                    district: addressData.district,
                    isDefault: addressData.isDefault,
                })
            );
        });

        it("should toggle the default address", async () => {
            const addressData = (
                await addressService.getAddressByID(user, "102")
            ).toJSON();
            addressData.isDefault = true;

            const address = await addressService.updateAddress(
                user,
                "102",
                addressData
            );

            expect(address).toEqual(
                expect.objectContaining({
                    addressID: "102",
                    phoneNumber: addressData.phoneNumber,
                    recipientName: addressData.recipientName,
                    address: addressData.address,
                    city: addressData.city,
                    district: addressData.district,
                    isDefault: addressData.isDefault,
                })
            );

            // Delay for 500ms to allow the database to update
            await new Promise((resolve) => setTimeout(resolve, 500));
            const { addresses: otherAddresses } =
                await addressService.getAddresses(user);

            otherAddresses.forEach((otherAddress) => {
                if (otherAddress.addressID !== address.addressID) {
                    expect(otherAddress.isDefault).toBe(false);
                }
            });
        });

        it("should throw ConflictError if there is no other address to set as default", async () => {
            const user = await User.findByPk("2");
            const addressData = (
                await addressService.getAddressByID(user, "201")
            ).toJSON();
            addressData.isDefault = false;

            await expect(
                addressService.updateAddress(user, "201", addressData)
            ).rejects.toThrow(ConflictError);
        });

        it("should throw ResourceNotFoundError if address not found", async () => {
            const addressData = {
                phoneNumber: "0987654321",
                recipientName: "Jane Doe",
                address: "456 Main St",
                city: "Othertown",
                district: "OtherDistrict",
                isDefault: false,
            };

            await expect(
                addressService.updateAddress(user, 999, addressData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("deleteAddress", () => {
        let address1;
        let address2;
        beforeAll(async () => {
            // Add two addresses for the user
            address1 = await addressService.createAddress(user, {
                phoneNumber: "1234567890",
                recipientName: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                district: "AnyDistrict",
            });

            address2 = await addressService.createAddress(user, {
                phoneNumber: "0987654321",
                recipientName: "Jane Doe",
                address: "456 Main St",
                city: "Othertown",
                district: "OtherDistrict",
            });
        });

        it("should delete the default address", async () => {
            const address = await Address.findOne({
                where: {
                    userID: user.userID,
                    isDefault: true,
                },
            });

            await addressService.deleteAddress(user, address.addressID);

            await expect(
                addressService.getAddressByID(user, address.addressID)
            ).rejects.toThrow(ResourceNotFoundError);

            // Delay for 500ms to allow the database to update
            await new Promise((resolve) => setTimeout(resolve, 500));
            const { addresses } = await addressService.getAddresses(user);

            // Default address should be set to one address
            let defaultAddressCount = 0;
            addresses.forEach((address) => {
                if (address.isDefault) {
                    defaultAddressCount++;
                }
            });
            expect(defaultAddressCount).toBe(1);
        });

        it("should delete the address", async () => {
            await addressService.deleteAddress(user, address1.addressID);

            await expect(
                addressService.getAddressByID(user, address1.addressID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
