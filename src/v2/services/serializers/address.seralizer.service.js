import Entity from "baiji-entity";

const AddressSerializer = new Entity({
    addressID: {
        type: "string",
        required: true,
    },
    address: {
        type: "string",
    },
    recipientName: {
        type: "string",
    },
    phoneNumber: {
        type: "string",
    },
    city: {
        type: "string",
    },
    district: {
        type: "string",
    },
    userID: [
        {
            type: "string",
        },
        function (obj, options) {
            if (options.detailAddress) {
                return obj.userID;
            }
            return undefined;
        },
    ],
    isDefault: [
        {
            type: "boolean",
        },
        function (obj, options) {
            if (options.detailAddress) {
                return obj.isDefault;
            }
            return undefined;
        },
    ],
    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.detailAddress) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],
    updatedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.detailAddress) {
                return obj.updatedAt;
            }
            return undefined;
        },
    ],
    deletedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeDeleted) {
                return obj.deletedAt;
            }
            return undefined;
        },
    ],
});

export default AddressSerializer;
