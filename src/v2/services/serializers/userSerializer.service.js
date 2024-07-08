import Serializer from "./serializer.service.js";
import { User } from "../../models/userOrder/user.model.js";
class UserAPIResponseSerializer extends Serializer {
    /**
     * Serialize a user object to a JSON object
     *
     * @param {User} user the user object to be serialized
     * @returns {Object} the serialized user object
     */
    serialize(user) {
        const userObj = JSON.parse(JSON.stringify(user));
        const {
            createdAt,
            updatedAt,
            refreshToken,
            password,
            phoneNumber,
            ...result
        } = userObj;

        if (this.includeTimestamps) {
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;
        }

        return result;
    }
}

export default UserAPIResponseSerializer;
