"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
// lambda/user/LogoutLambda.ts (or .js) — replace handler body with:
const handler = async (request) => {
    // be permissive about incoming token shape
    const incomingAuth = request?.authToken;
    const token = (incomingAuth && (incomingAuth.token ?? incomingAuth._token)) ??
        // as last resort, if client sent token directly
        (typeof request === "string" ? request : undefined);
    if (!token) {
        // respond with 400 and a helpful message
        return {
            success: false,
            message: "Missing auth token in request. Expected authToken.token or authToken._token",
        };
    }
    await LambdaService_1.userService.logout(token);
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
