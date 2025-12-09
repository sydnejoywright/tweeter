"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const handler = async (request) => {
    let bytes = null;
    // Only convert the image if both fields are provided
    if (request.userImageBytes && request.imageFileExtension) {
        bytes = new Uint8Array(Buffer.from(request.userImageBytes, "base64"));
    }
    const [user, authToken] = await LambdaService_1.userService.register(request.firstName, request.lastName, request.alias, request.password, bytes ?? undefined, // can be null if no image provided
    request.imageFileExtension ?? undefined);
    return {
        success: true,
        message: null,
        user,
        authToken,
    };
};
exports.handler = handler;
