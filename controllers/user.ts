import User from '../models/user_model'
import {Request, Response} from 'express'

const getUserById = async (req: Request,res: Response)=>{
    console.log(req.params.id)
    try{
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    }catch(err){
        res.status(400).send({'error': 'Failed to get user from DB'})
    }
}

const upadteUser = async (req: Request,res: Response)=>{
    console.log(req.body.id)
    console.log(req.body.avatarUrl)
    console.log(req.body.name)
       

    const name= req.body.name;
    const avatarUrl = req.body.avatarUrl;
    const id = req.body.id;

    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                name,
                avatarUrl,
            }
        });

        await user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}


export = {getUserById,upadteUser}