import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app)
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb'}))
app.use(bodyParser.json())

import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL) //,{ useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error=>{console.error(error)})
db.once('open', ()=>{console.log('connected to mongo DB')})


import postRouter from './routes/postRoute'
import indexRouter from './routes/indexRoute'
import authRouter from './routes/authRoute'
import fileRoute from './routes/fileRoute'
import userRoute from './routes/userRoute'

app.use('/post',postRouter)
app.use('/',indexRouter)
app.use('/auth',authRouter)
app.use('/file',fileRoute)
app.use('/user',userRoute)
app.use('/src/uploads',express.static('src/uploads'))

import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev REST API",
                version: "1.0.0",
                description: "REST server including authtentication using JWT",
            },
            servers: [{url: "http://localhost:3000",},],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

export = server