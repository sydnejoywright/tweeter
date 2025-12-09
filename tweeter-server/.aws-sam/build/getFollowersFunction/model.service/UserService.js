"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    userDao;
    imageDao;
    authDao;
    tokenLife;
    constructor(userDao, imageDao, authDao, tokenLife = 600) {
        this.userDao = userDao;
        this.imageDao = imageDao;
        this.authDao = authDao;
        this.tokenLife = tokenLife;
    }
    async getUser(alias) {
        return this.userDao.getUserByAlias(alias);
    }
    async login(alias, password) {
        const user = await this.userDao.getUserByAlias(alias);
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        const token = await this.authDao.createAuthToken(alias, this.tokenLife);
        return [user, token];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        let imageUrl = null;
        // Only upload image if provided
        if (userImageBytes && imageFileExtension) {
            imageUrl = await this.imageDao.uploadUserImage(alias, userImageBytes, imageFileExtension);
        }
        const user = {
            firstName,
            lastName,
            alias,
            ...(imageUrl && { imageUrl }),
        };
        await this.userDao.createUser(user, password, userImageBytes ?? undefined, imageFileExtension ?? undefined);
        const authToken = await this.authDao.createAuthToken(alias, this.tokenLife);
        return [user, authToken];
    }
    async logout(authToken) {
        await this.authDao.revokeAuthToken(authToken);
    }
}
exports.UserService = UserService;
exports.default = UserService;
