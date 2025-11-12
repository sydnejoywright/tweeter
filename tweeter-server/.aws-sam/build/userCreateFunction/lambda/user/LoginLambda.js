"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = __importDefault(require("../../model.service/UserService"));
const handler = async (request) => {
    const userService = new UserService_1.default();
    const [user, authToken] = await userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken.token,
    };
};
exports.handler = handler;
