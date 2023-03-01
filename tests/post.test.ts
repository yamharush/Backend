import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'

const newPostMessage = 'This is the new test post message'
const newPostSender = '999555'

beforeAll(async ()=>{
    await Post.remove()
})

afterAll(async ()=>{
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{
    
    /*
    test("Get all posts", async()=>{
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
    })
    */

    test("Add new post", async ()=>{
        const response = await request(app).post('/post').send({
            "message" : newPostMessage,
            "sender" : newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
})