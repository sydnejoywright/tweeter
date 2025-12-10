"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const AuthorizationService_1 = require("../../model.service/lambda_service/AuthorizationService");
const handler = async (request) => {
    try {
        const currentUser = await LambdaService_1.authService.authenticate(request.authToken);
        const statusToPost = { ...request.newStatus };
        await LambdaService_1.statusService.postStatus(statusToPost);
        return {
            success: true,
            message: null,
        };
    }
    catch (e) {
        if (e instanceof AuthorizationService_1.AuthorizationError) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }
        throw e;
    }
};
exports.handler = handler;
