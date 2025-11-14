"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = __importDefault(require("../../model.service/FollowService"));
const handler = async (request) => {
    console.log("Hit server side GetIsFollowerStatusLambda!");
    const followService = new FollowService_1.default();
    const following = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
    return {
        success: true,
        message: null,
        following: following
    };
};
exports.handler = handler;
