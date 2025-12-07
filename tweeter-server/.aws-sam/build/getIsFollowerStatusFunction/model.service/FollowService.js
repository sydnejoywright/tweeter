"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
class FollowService {
    userDao;
    followDao;
    constructor(userDao, followDao) {
        this.followDao = followDao;
        this.userDao = userDao;
    }
    async loadMoreFollowees(userAlias, pageSize, lastItem) {
        return this.followDao.getFolloweeItems(userAlias, pageSize, lastItem);
    }
    async loadMoreFollowers(userAlias, pageSize, lastItem) {
        return this.followDao.getFollowerItems(userAlias, pageSize, lastItem);
    }
    async getIsFollowerStatus(user, selectedUser) {
        return this.followDao.getIsFollowerStatus(user, selectedUser);
    }
    async getFolloweeCount(user) {
        return this.followDao.getFolloweeCount(user);
    }
    async getFollowerCount(user) {
        return this.followDao.getFollowerCount(user);
    }
    async follow(currentUser, userToFollow) {
        await this.followDao.follow(currentUser, userToFollow);
        const followerCount = await this.getFollowerCount(userToFollow);
        const followeeCount = await this.getFolloweeCount(currentUser);
        return [followerCount, followeeCount];
    }
    async unfollow(currentUser, userToUnfollow) {
        await this.followDao.unfollow(currentUser, userToUnfollow);
        const followerCount = await this.getFollowerCount(currentUser);
        const followeeCount = await this.getFolloweeCount(currentUser);
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
exports.default = FollowService;
