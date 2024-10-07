import { StatusCodes } from "http-status-codes";

class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFound";
        this.isCustomError = true;
        this.code = StatusCodes.NOT_FOUND;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "Unauthorized";
        this.isCustomError = true;
        this.code = StatusCodes.UNAUTHORIZED;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "Forbidden";
        this.isCustomError = true;
        this.code = StatusCodes.FORBIDDEN;
    }
}

class BadRequestError extends Error {
    constructor(
        message,
        metadata = { type: undefined, value: undefined, location: undefined }
    ) {
        super(message);
        this.name = "BadRequest";
        this.isCustomError = true;
        this.code = StatusCodes.BAD_REQUEST;
        this.type = metadata.type;
        this.value = metadata.value;
        this.location = metadata.location;
    }
}

class GoneError extends Error {
    constructor(message) {
        super(message);
        this.name = "Gone";
        this.isCustomError = true;
        this.code = StatusCodes.GONE;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "Conflict";
        this.isCustomError = true;
        this.code = StatusCodes.CONFLICT;
    }
}

export {
    ResourceNotFoundError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    ConflictError,
    GoneError,
};
