"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    // move to follow folder anything with follow folder
    follow(authToken, userToFollow) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the following message. Remove when connected to the server
            yield new Promise((f) => setTimeout(f, 2000));
            // TODO: Call the server
            let followersCount = yield this.getFollowersCount(authToken, userToFollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToFollow);
            return [followersCount, followeesCount];
        });
    }
    ;
    unfollow(authToken, userToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the unfollowing message. Remove when connected to the server
            yield new Promise((f) => setTimeout(f, 2000));
            // TODO: Call the server
            let followersCount = yield this.getFollowersCount(authToken, userToUnfollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToUnfollow);
            return [followersCount, followeesCount];
        });
    }
    ;
    getIsFollowerStatus(authToken, user, selectedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.isFollower();
        });
    }
    ;
    getFolloweesCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.getFolloweesCount(user);
        });
    }
    ;
    getFollowersCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.getFollowersCount(user);
        });
    }
    ;
}
exports.FollowService = FollowService;
