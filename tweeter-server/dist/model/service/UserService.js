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
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling the server
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (user === null) {
                throw new Error("Invalid alias or password");
            }
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    ;
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the logging out message. Delete when the call to the server is implemented.
            yield new Promise((res) => setTimeout(res, 1000));
        });
    }
    ;
    register(firstName, lastName, alias, password, userImageString) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not neded now, but will be needed when you make the request to the server in milestone 3
            // TODO: Replace with the result of calling the server
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (user === null) {
                throw new Error("Invalid registration");
            }
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    ;
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        });
    }
    ;
    loadMoreFollowers(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
        });
    }
    ;
    loadMoreFollowees(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
        });
    }
    ;
}
exports.UserService = UserService;
