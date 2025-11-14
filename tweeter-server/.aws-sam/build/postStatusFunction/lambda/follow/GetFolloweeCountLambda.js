"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = __importDefault(require("../../model.service/FollowService"));
const handler = async (request) => {
    const followService = new FollowService_1.default;
    const count = await followService.getFolloweeCount(request.token, request.user);
    return {
        success: true,
        message: null,
        count: count
    };
};
exports.handler = handler;
