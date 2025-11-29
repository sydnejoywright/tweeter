"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    ;
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    ;
    async getFakeData(lastItem, pageSize, userAlias) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
    async getIsFollowerStatus(authToken, user, selectedUser) {
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    ;
    async getFolloweeCount(authToken, user) {
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(tweeter_shared_1.User.fromDto(user).alias);
    }
    ;
    async getFollowerCount(authToken, user) {
        return tweeter_shared_1.FakeData.instance.getFollowerCount(tweeter_shared_1.User.fromDto(user).alias);
    }
    ;
    async follow(authToken, userToFollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
        return [followerCount, followeeCount];
    }
    ;
    async unfollow(authToken, userToUnfollow) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
        return [followerCount, followeeCount];
    }
    ;
}
exports.FollowService = FollowService;
exports.default = FollowService;
