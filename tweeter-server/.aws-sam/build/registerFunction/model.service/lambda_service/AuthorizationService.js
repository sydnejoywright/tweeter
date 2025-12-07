"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = exports.AuthorizationError = void 0;
class AuthorizationError extends Error {
    constructor(msg = "Unauthorized") {
        super(msg);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
exports.AuthorizationError = AuthorizationError;
class AuthorizationService {
    authDao;
    userDao;
    constructor(authDao, userDao) {
        this.authDao = authDao;
        this.userDao = userDao;
    }
    async authenticate(authToken) {
        const alias = await this.authDao.validateAuthToken(authToken);
        if (!alias)
            throw new AuthorizationError("Invalid or expired auth token");
        const user = await this.userDao.getUserByAlias(alias);
        if (!user)
            throw new AuthorizationError("User not found");
        return user;
    }
}
exports.AuthorizationService = AuthorizationService;
