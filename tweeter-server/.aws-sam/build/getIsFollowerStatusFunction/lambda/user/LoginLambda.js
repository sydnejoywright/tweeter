"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const handler = async (request) => {
    const [user, authToken] = await LambdaService_1.userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
};
exports.handler = handler;
