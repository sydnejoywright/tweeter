"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const buffer_1 = require("buffer");
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(authToken, alias) {
        return this.getFakeUser(alias);
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
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
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.token];
    }
    ;
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const imageStringBase64 = buffer_1.Buffer.from(userImageBytes).toString("base64");
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken.token];
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
