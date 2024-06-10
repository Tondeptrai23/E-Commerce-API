class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ResourceNotFound";
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "Unauthorized";
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "Forbidden";
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequest";
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "Conflict";
    }
}

export {
    ResourceNotFoundError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    ConflictError,
};
