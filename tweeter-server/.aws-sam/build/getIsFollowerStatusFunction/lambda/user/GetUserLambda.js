"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LambdaService_1 = require("../../model.service/lambda_service/LambdaService");
const AuthorizationService_1 = require("../../model.service/lambda_service/AuthorizationService");
const handler = async (request) => {
    try {
        // Authenticate the requester
        await LambdaService_1.authService.authenticate(request.authToken);
        // Get the user DTO
        const userDto = await LambdaService_1.userService.getUser(request.userAlias);
        if (!userDto) {
            return {
                success: true,
                message: null,
                user: null,
            };
        }
        // Compute full S3 URL if needed
        const fullImageUrl = userDto.imageUrl && !userDto.imageUrl.startsWith("http")
            ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${userDto.imageUrl}`
            : userDto.imageUrl;
        console.log("Computed full S3 URL:", fullImageUrl); // Return a new object without mutating the readonly DTO
        const userWithFullImageUrl = {
            ...userDto,
            imageUrl: fullImageUrl,
        };
        return {
            success: true,
            message: null,
            user: userWithFullImageUrl,
        };
    }
    catch (e) {
        if (e instanceof AuthorizationService_1.AuthorizationError) {
            return {
                success: false,
                message: "Unauthorized",
                user: null,
            };
        }
        throw e;
    }
};
exports.handler = handler;
