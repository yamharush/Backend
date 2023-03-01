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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const newPostMessage = 'This is the new test post message';
const newPostSender = '999555';
const newPostAvatarUrl = 'https://example.com/avatar.png';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.deleteMany({});
    mongoose_1.default.connection.close();
}));
describe("Posts Tests", () => {
    test("Get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        yield post_model_1.default.create({
            message: "This is a test post message",
            sender: "sender1",
            avatarUrl: newPostAvatarUrl
        });
        const response = yield (0, supertest_1.default)(server_1.default).get("/post");
        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const post = response.body[0];
        expect(post).toHaveProperty("_id");
        expect(post).toHaveProperty("message");
        expect(post).toHaveProperty("sender");
    }));
    test("Add new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/post").send({
            message: newPostMessage,
            sender: newPostSender,
            avatarUrl: "https://example.com/avatar.png",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
    }));
    test("Get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield post_model_1.default.create({
            message: "This is a test post message",
            sender: "sender1",
            avatarUrl: "https://example.com/avatar.png",
        });
        const response = yield (0, supertest_1.default)(server_1.default).get(`/post/${post._id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(post.message);
        expect(response.body.sender).toEqual(post.sender);
    }));
    test("Get all posts event", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/post/events");
        expect(response.statusCode).toEqual(200);
        expect(response.body.status).toEqual("OK");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=post.test.js.map