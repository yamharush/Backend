import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'

const newPostMessage = 'This is the new test post message'
const newPostSender = '999555'
const newPostAvatarUrl = 'https://example.com/avatar.png'

beforeAll(async () => {
    await Post.deleteMany({});
});

afterAll(async () => {
    await Post.deleteMany({});
    mongoose.connection.close();
});

describe("Posts Tests", () => {

    test("Get all posts", async () => {
        await Post.create({
            message: "This is a test post message",
            sender: "sender1",
            avatarUrl: newPostAvatarUrl
        });

        const response = await request(app).get("/post");
        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const post = response.body[0];
        expect(post).toHaveProperty("_id");
        expect(post).toHaveProperty("message");
        expect(post).toHaveProperty("sender");
    });


    test("Add new post", async () => {
        const response = await request(app).post("/post").send({
            message: newPostMessage,
            sender: newPostSender,
            avatarUrl: "https://example.com/avatar.png",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
    });
    test("Get post by id", async () => {
        const post = await Post.create({
            message: "This is a test post message",
            sender: "sender1",
            avatarUrl: "https://example.com/avatar.png",
        });

        const response = await request(app).get(`/post/${post._id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(post.message);
        expect(response.body.sender).toEqual(post.sender);
    });
    test("Get all posts event", async () => {
        const response = await request(app).get("/post/events");
        expect(response.statusCode).toEqual(200);
        expect(response.body.status).toEqual("OK");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

})