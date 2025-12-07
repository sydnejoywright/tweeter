"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const handler = async (request) => {
    await LambdaService_1.userService.logout(request.authToken.token);
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
