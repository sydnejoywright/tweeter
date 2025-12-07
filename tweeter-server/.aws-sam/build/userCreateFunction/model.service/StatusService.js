"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
class StatusService {
    userDao;
    followDao;
    authDao;
    statusDao;
    constructor(userDao, followDao, authDao, statusDao) {
        this.userDao = userDao;
        this.followDao = followDao;
        this.authDao = authDao;
        this.statusDao = statusDao;
    }
    async loadMoreFeedItems(userAlias, pageSize, lastItem) {
        //To do: verify auth token?
        return await this.statusDao.getFeedItems(userAlias, pageSize, lastItem);
    }
    async loadMoreStoryItems(userAlias, pageSize, lastItem) {
        //verify auth token?
        return await this.statusDao.getStoryItems(userAlias, pageSize, lastItem);
    }
    async postStatus(newStatus) {
        //verify auth token?
        return await this.statusDao.postStatus(newStatus);
    }
}
exports.StatusService = StatusService;
exports.default = StatusService;
