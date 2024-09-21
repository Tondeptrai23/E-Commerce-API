class AddressController {
    async createAddress(req, res) {
        res.json({ message: "Create an address" });
    }

    async getUserAddresses(req, res) {
        res.json({ message: "Get all addresses" });
    }

    async getUserAddress(req, res) {
        res.json({ message: "Get an address" });
    }

    async updateAddress(req, res) {
        res.json({ message: "Update an address" });
    }

    async deleteAddress(req, res) {
        res.json({ message: "Delete an address" });
    }
}

export default new AddressController();
