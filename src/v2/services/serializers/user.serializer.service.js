import Entity from "./index.serializer.service.js";

const UserSerializer = new Entity({
    userID: {
        type: "string",
        required: true,
    },
    email: [
        {
            type: "string",
        },
        function (obj, options) {
            if (options.isAdmin) {
                return obj.email;
            }
            return undefined;
        },
    ],
    name: {
        type: "string",
    },
    avatar: {
        type: "string",
    },
    role: {
        type: "string",
    },
});

export default UserSerializer;
