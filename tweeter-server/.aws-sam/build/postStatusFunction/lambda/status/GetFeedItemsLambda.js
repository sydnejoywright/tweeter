"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const AuthorizationService_1 = require("../../model.service/lambda_service/AuthorizationService");
const BUCKET = "tweeter-server-profile-pics-try1";
const REGION = "us-east-1";
const handler = async (request) => {
    try {
        // Authenticate the user
        const currentUser = await LambdaService_1.authService.authenticate(request.authToken);
        // Fetch feed items from the service
        const [items, hasMore] = await LambdaService_1.statusService.loadMoreFeedItems(request.userAlias, request.pageSize, request.lastItem);
        // If no items returned, set as empty array
        if (!items) {
            return {
                success: true,
                message: null,
                items: [],
                hasMore: false,
            };
        }
        // Transform items: ensure user.imageUrl is full URL or empty
        const transformedItems = items.map((status) => {
            const user = status.user;
            const imageUrl = user.imageUrl && !user.imageUrl.startsWith("http")
                ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${user.imageUrl}`
                : user.imageUrl; // leave empty if no image
            return {
                post: status.post,
                timestamp: status.timestamp,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    alias: user.alias,
                    imageUrl,
                },
            };
        });
        // Return the transformed feed items
        return {
            success: true,
            message: null,
            items: transformedItems,
            hasMore: hasMore,
        };
    }
    catch (e) {
        if (e instanceof AuthorizationService_1.AuthorizationError) {
            return {
                success: false,
                message: "Unauthorized",
                items: null,
                hasMore: false,
            };
        }
        throw e;
    }
};
exports.handler = handler;
