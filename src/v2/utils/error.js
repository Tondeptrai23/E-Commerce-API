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
    constructor(message) {
        super(message);
        this.name = "BadRequest";
        this.isCustomError = true;
        this.code = StatusCodes.BAD_REQUEST;
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
};
