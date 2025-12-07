"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const handler = async (request) => {
    //turn the string back to a bytes array
    const bytes = new Uint8Array(Buffer.from(request.userImageBytes, "base64"));
    const [user, authToken] = await LambdaService_1.userService.register(request.firstName, request.lastName, request.alias, request.password, bytes, request.imageFileExtension);
    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
};
exports.handler = handler;
