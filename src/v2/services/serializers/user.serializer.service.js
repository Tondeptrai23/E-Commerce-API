import Entity from "./index.serializer.service.js";

const UserSerializer = new Entity({
    userID: {
        type: "string",
        required: true,
    },
    email: {
        type: "string",
    },
    name: {
        type: "string",
    },
    avatar: {
        type: "string",
    },
    role: {
        type: "string",
    },
    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
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
            if (options.includeTimestamps) {
                return obj.updatedAt;
            }
            return undefined;
        },
    ],
});

export default UserSerializer;
