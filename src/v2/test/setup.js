import { jest } from "@jest/globals";
import { s3 } from "../config/aws.config.js";

jest.setTimeout(30000); // 30 seconds

// Mock AWS SDK
jest.spyOn(s3, "putObject").mockImplementation(() => {
    return {
        promise: jest.fn().mockResolvedValue(),
    };
});

jest.spyOn(s3, "deleteObject").mockImplementation(() => {
    return {
        promise: jest.fn().mockResolvedValue(),
    };
});
