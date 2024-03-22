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
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Starting");
        const statusService = new StatusService_1.StatusService();
        // Deserialize the request
        const authToken = event.authToken;
        const user = event.user;
        const pageSize = event.pageSize;
        const lastItem = event.lastItem;
        console.log("LoadMoreFeedItemsLambda: authToken", authToken);
        console.log("LoadMoreFeedItemsLambda: user", user);
        console.log("LoadMoreFeedItemsLambda: pageSize", pageSize);
        console.log("LoadMoreFeedItemsLambda: lastItem", lastItem);
        console.log("Last Item User", lastItem === null || lastItem === void 0 ? void 0 : lastItem.user);
        console.log("Last Item User Alias", lastItem === null || lastItem === void 0 ? void 0 : lastItem.user.alias);
        console.log("LoadMoreFeedItemsLambda: event", event);
        let [statuses, hasMore] = yield statusService.loadMoreFeedItems(authToken, user, pageSize, lastItem);
        console.log("LoadMoreFeedItemsLambda: statuses", statuses);
        const response = new tweeter_shared_1.LoadMoreStatusesResponse(true, statuses, hasMore);
        console.log("LoadMoreFeedItemsLambda: response", response);
        return response;
    }
    catch (e) {
        throw new Error(`400: ${e}`);
    }
});
exports.handler = handler;
