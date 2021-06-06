const express = require('express')
const myUser = require('../models/myuser')
const router = new express.Router()
const { MongoClient, ObjectID } = require('mongodb')
const auth = require('../middleware/auth')
//list of all users done
router.get("/userslist", auth , (req,res)=>{

    myUser.myUserModel.find({}).sort([['_id', -1]]).then((users)=>{
        let response={
            status :1,
            message:'success', 
            data  :users
        }
        res.send(response)
    }).catch((error)=>{
        let response={
            status :0,
            message:'error', 
            data   :error
        }
        res.send(response)
    })
})

// add user done
router.post("/adduser",async(req,res)=>{
    
    const user = new myUser.myUserModel(req.body)
    try{
        await user.save()
        let response={
            status :1,
            message:'success', 
            data  :[]
        }
        res.send(response)
    }catch(error){
        let response={
            status :0,
            message:'error', 
            data   :error
        }
        res.send(response)
    }
    
})
//login done
router.post('/users/login', async (req, res) => {
    try {
            console.log(req.body)
            //step1 credentials verification
            const user = await myUser.myUserModel.findByCredentials(req.body.email,req.body.password)
            //step2 create token and save token in database
            const token = await user.generateAuthToken()
            let response={
                status :1,
                message:'success',  
                data  :{
                    user:user,
                    token:token
                }
            }
            res.send(response)
    } catch (error) {
        let response={
            status :0,
            message:'Please authenticate!', 
            data  :error
        }
        res.send(response)
    }
})

//get user profile done
router.get("/user/me", auth , async (req,res)=>{
    const user = await myUser.myUserModel.find({ _id: req.user._id }).sort([['_id', -1]]).populate({path: 'usertasks'});
    let response={
        status :1,
        message:'success',  
        data  :{
            user:user,
            token:req.token
        }
    }
    res.send(response)
})
//update user done
router.post('/updateuser', auth, async (req, res) => {
   const updkeys=Object.keys(req.body)
   const allowedUpdates = [ 'name', 'email', 'password', 'phoneno', 'address','age','designation']
   const isValidOperation = updkeys.every((update) =>  allowedUpdates.includes(update))
   
   if (!isValidOperation) {
        let response={
            status :0,
            message:'Invalid updates!', 
            data  :[]
        }
        res.send(response)
    }
    try {
        updkeys.forEach(function(key) {
           req.user[key]=req.body[key]
        });
        await req.user.save()
        let response={
            status :1,
            message:'success', 
            data  :req.user
        }
        res.send(response)
    } catch (e) {
        let response={
            status :0,
            message:e, 
            data  :[]
        }
        res.send(response)
    }
})
module.exports = router