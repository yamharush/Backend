import Post from '../models/post_model'
import {Request, Response} from 'express'

const getAllPostsEvent = async () => {
    console.log('')
    try {
            const posts = await Post.find()
            return {status: 'OK', data: posts}
    } catch(err) {
        return {status: 'FAIL', data: ''}
    }
}

const getAllPosts = async (req: Request,res: Response)=>{
    try {
        let posts = {}
        if(req.query.sender == null) {
            posts = await Post.find()
        }else {
            posts = await Post.find({'sender': req.query.sender})
        }
        res.status(200).send(posts)
    } catch(err) {
        res.status(400).send({'error': 'Failed to get posts from DB'})
    }
}


const getPostById = async (req: Request,res: Response)=>{
    console.log(req.params.id)
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch(err) {
        res.status(400).send({'error': 'Failed to get post from DB'})
    }
}


const addNewPost = async (req: Request,res: Response)=>{
    console.log(req.body)

    const post = new Post({
        message : req.body.message,
        sender : req.body.sender,
        avatarUrl : req.body.avatarUrl
    })
    
    try {
        const newPost = await post.save()
        console.log('post saved in DB')
        res.status(200).send(newPost)
    } catch(err){
        console.log('failed to save post in DB')
        res.status(400).send({'error': 'Failed add post to DB'})
    }
}


export = {getAllPosts ,addNewPost, getPostById, getAllPostsEvent}