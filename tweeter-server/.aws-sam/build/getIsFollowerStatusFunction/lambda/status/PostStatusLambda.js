"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = __importDefault(require("../../model.service/StatusService"));
const handler = async (request) => {
    const statusService = new StatusService_1.default;
    await statusService.postStatus(request.authToken, request.newStatus);
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
