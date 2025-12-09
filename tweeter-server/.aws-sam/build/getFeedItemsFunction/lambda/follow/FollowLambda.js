"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const AuthorizationService_1 = require("../../model.service/lambda_service/AuthorizationService");
const handler = async (request) => {
    try {
        const currentUser = await LambdaService_1.authService.authenticate(request.authToken);
        const followee = request.userToFollow;
        const [followerCount, followeeCount] = await LambdaService_1.followService.follow(currentUser, followee);
        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount,
        };
    }
    catch (e) {
        if (e instanceof AuthorizationService_1.AuthorizationError) {
            return {
                success: false,
                message: "Unauthorized",
                followeeCount: null,
                followerCount: null,
            };
        }
        throw e;
    }
};
exports.handler = handler;
