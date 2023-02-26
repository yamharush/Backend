import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const userPassword = "12345"
const userName = 'user1'
let accessToken = ''
let refreshToken = ''

beforeAll(async () => {
    await Post.remove()
    await User.remove()
})

afterAll(async () => {
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe("Auth Tests", () => {
    test("Not aquthorized attempt test", async () => {
        const response = await request(app).get('/post');
        expect(response.statusCode).toEqual(200)
    })

    test("Register test", async () => {
        const response = await request(app).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword,
            "name": userName
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test wrog password", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword + '4',
            "name": userName
        })
        expect(response.statusCode).not.toEqual(200)
        const access = response.body.accesstoken
        expect(access).toBeUndefined()
    })

    test("Login test", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword,
            "name": userName
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })


    test("test sign valid access token", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)
    })

    // Test sign wrong access token
    test("test sign wrong access token", async () => {
        const response = await request(app).get('/auth').set('Authorization', 'Bearer 1' + accessToken);
        expect(response.statusCode).toEqual(400);
    });

    jest.setTimeout(15000)

    // Test expired token
    test("test expired token", async () => {
        await new Promise(r => setTimeout(r, 6000));
        const response = await request(app).get('/auth').set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toEqual(400);
    });
    test("test refresh token", async () => {
        let response = await request(app).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200)

        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()

        response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)

    })

    test("Logout test", async () => {
        const response = await request(app).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken)
        expect(response.statusCode).toEqual(200)
    })

    // Test for auth/logout route
    // Test for auth/logout route
    test("logout user and invalidate refresh token", async () => {
        // Log in user and obtain refresh token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: "user1@gmail.com",
                password: userPassword,
                name: "user1"

            });
        const refreshToken = loginResponse.body.refreshToken;

        // Log out user with refresh token
        const logoutResponse = await request(app)
            .get('/auth/logout')
            .set('Authorization', 'Bearer ' + refreshToken);

        expect(logoutResponse.statusCode).toEqual(200);
    });

    // Test for auth/getUserInfo route
    test("get user information", async () => {
        // Log in user and obtain access token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: "user1@gmail.com",
                password: userPassword,
                name: "user1"

            });
        const accessToken = loginResponse.body.accessToken;

        // Get user information with access token
        const response = await request(app)
            .get('/auth')
            .set('Authorization', 'Bearer ' + accessToken);

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual("user1");
        expect(response.body.email).toEqual("user1@gmail.com");
    });
    // Test for auth/updateUser route
    test("update user information", async () => {
        // Log in user and obtain access token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: "user@example.com",
                password: "password"
            });
        const accessToken = loginResponse.body.accessToken;

        // Update user information with access token
        const response = await request(app)
            .put('/auth')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
                name: "Jane Doe",
                email: "jane.doe@example.com",
                password: "newpassword"
            });

        expect(response.statusCode).toEqual(200);
    });


})