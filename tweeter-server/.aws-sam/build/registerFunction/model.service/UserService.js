"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(authToken, alias) {
        return this.getFakeUser(alias);
    }
    ;
    async getFakeUser(userAlias) {
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(userAlias);
        if (!user) {
            return null;
        }
        return user.dto;
    }
    async login(alias, password) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.token];
    }
    ;
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.token];
    }
    ;
    async logout(authToken) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
    ;
}
exports.UserService = UserService;
exports.default = UserService;
