import { StatusCodes } from "http-status-codes";

const assertTokenNotProvided = (res) => {
    expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res.body).toEqual(
        expect.objectContaining({
            success: false,
            errors: expect.any(Array),
        })
    );

    expect(res.body.errors[0]).toEqual(
        expect.objectContaining({
            error: "Unauthorized",
            message: "Token not found",
        })
    );
};

const assertTokenInvalid = (res) => {
    expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res.body).toEqual(
        expect.objectContaining({
            success: false,
            errors: expect.any(Array),
        })
    );

    expect(res.body.errors[0]).toEqual(
        expect.objectContaining({
            error: "TokenInvalid",
            message: "Token invalid",
        })
    );
};

const assertNotAnAdmin = (res) => {
    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res.body).toEqual(
        expect.objectContaining({
            success: false,
            errors: expect.any(Array),
        })
    );

    expect(res.body.errors[0]).toEqual(
        expect.objectContaining({
            error: "Forbidden",
            message: "Not an admin. Cannot retrieve administrative data",
        })
    );
};

export { assertTokenNotProvided, assertTokenInvalid, assertNotAnAdmin };
