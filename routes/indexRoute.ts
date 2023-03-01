/**
 * @swagger
 * tags:
 *   name: Index
 *   description: The Index API 
 */

import express from 'express'
const router = express.Router()

router.get('/',(req, res)=>{
    res.send('Hello world!!')
})


export = router