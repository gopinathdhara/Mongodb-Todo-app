const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

// add task done
router.post('/addtasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        let response={
            status :1,
            message:'success', 
            data  :[]
        }
        res.send(response)
    } catch (e) {
        let response={
            status :0,
            message:'error', 
            data   :e
        }
        res.send(response)
    }
})
//fetch all task of specific user done
router.get('/alltasks', auth, async (req, res) => {

    try {
        //const task = await Task.find({ owner: req.user._id }).sort([['_id', -1]]).populate({path: 'owner', select: 'name'});
        const task = await Task.find({ owner: req.user._id }).sort([['_id', -1]]).populate({path: 'owner'});
        if (!task) {
            let response={
                status :0,
                message:'No record found', 
                data   :[]
            }
            res.send(response)
        }
        let response={
            status :1,
            message:'success', 
            data:task
        }
        res.send(response)
    } catch (e) {
        let response={
            status :0,
            message:'error', 
            data   :e
        }
        res.send(response)
    }
})
//get specific task done
router.get('/tasks/:id', auth, async (req, res) => {
    const task_id=req.params.id;
    try{
        const task=await Task.findOne({ _id: task_id, owner:req.user._id }).populate({path: 'owner'});
        if (!task) {
            let response={
                status :0,
                message:'No record found', 
                data   :[]
            }
            res.send(response)
        }
        else{
            let response={
                status :1,
                message:'success', 
                data:task
            }
            res.send(response)
        }
    }catch(e){
        let response={
            status :0,
            message:'error', 
            data   :e
        }
        res.send(response)
    }
})

//task update done
router.post('/updatetasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','description','priority', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        let response={
            status :0,
            message:'Invalid updates!', 
            data   :[]
        }
        res.send(response)
    }
    try {

        //db.collection.findOneAndUpdate(filter, update, options)

        const updateobj={
            'title':req.body.title,
            'description':req.body.description,
            'completed':req.body.completed,
            'priority':req.body.priority,
        }

        const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id}, updateobj)
        if (!task) {
            let response={
                status :0,
                message:'No record found', 
                data   :[]
            }
            res.send(response)
        }
        const taskinfo=await Task.findOne({ _id: req.params.id, owner:req.user._id }).populate({path: 'owner'});
        let response={
            status :1,
            message:'success', 
            data:taskinfo
        }
        res.send(response)

        /*
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
        */
        
    } catch (e) {
        let response={
            status :0,
            message:'error', 
            data   :e
        }
        res.send(response)
    }
})
//task delete
router.get('/deletetasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            let response={
                status :0,
                message:'No record found', 
                data   :[]
            }
            res.send(response)
        }
        let response={
            status :1,
            message:'success', 
            data:task
        }
        res.send(response)
    } catch (e) {
        let response={
            status :0,
            message:'error', 
            data   :e
        }
        res.send(response)
    }
})
module.exports = router