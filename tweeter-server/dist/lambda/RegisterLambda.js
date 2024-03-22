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
const UserService_1 = require("../model/service/UserService");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let [user, token] = yield new UserService_1.UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageString);
    return new tweeter_shared_1.AuthenticateResponse(true, user, token);
});
exports.handler = handler;
// JSON input: {"firstName":"John","lastName":"Doe","alias":"johndoe","password":"password","userImageBytes":"dGVzdA=="}
//{"errorType":"TypeError","errorMessage":"The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined","trace":["TypeError [ERR_INVALID_ARG_TYPE]: The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined","    at Function.from (node:buffer:324:9)","    at UserService.register (/var/task/index.js:5052:50)","    at Runtime.handler (/var/task/index.js:5072:47)","    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)"]}
