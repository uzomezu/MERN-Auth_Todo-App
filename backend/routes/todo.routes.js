const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const passport = require('passport');
const validateTodoInput = require('../validation/todo');




//get all todos
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        //req.user = mongo _id for current user
        const mongo_user_id = req.user._id;
        console.log(mongo_user_id);
        const userTodos = await Todo.find({user: mongo_user_id})
        if(userTodos) {
            res.json(userTodos);
        } else {
            res.json({message: "You have completed all your tasks!"})
        }
    } catch (err) {
        res.status(400).json({message: err});
    } 
})

// create a todo
router.post('/create', passport.authenticate('jwt', {session: false}), async (req, res) => {

    
        //validation
        const {errors, isValid} = validateTodoInput(req.body);
        if(!isValid){
            res.status(400).json(errors);
        }
        const duplicateTodo = await Todo.findOne({text : req.body.text});

        if(duplicateTodo){
            res.status(400).json({errors: "Cannot make same todo twice"});
        }
        // create new todo item
        const newTodo =  new Todo({
            user : req.user._id,
            text : req.body.text,
            complete : req.body.complete,
            comments : req.body.comments
        });
        
        //save to db
        await newTodo.save()
            .then(
            todo =>
            res.json(todo)
            ).catch(err=>res.status(400).json({message: err}))
        
    
})

//edit a todo
router.put('/edit/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        //Validationc
        const {errors, isValid} = validateTodoInput(req.body);
        if(!isValid){
            res.status(400).json(errors);
        }
        //find todo
        const currTodo = await Todo.findById(req.params.id);
        console.log(currTodo);
        //edit the JSON object
        if(currTodo){
            currTodo.text = req.body.text || currTodo.text;
            currTodo.complete = req.body.complete || currTodo.complete;
            currTodo.comments = req.body.comments || currTodo.comments;
        }
        //save it to mongodb with async/await event
        const updatedTodo = await currTodo.save();
        //respond with message and the JSON object
        res.json({message: "Todo has been updated", updatedTodo});
    } catch (err) {
        res.status(400).json({message: err});
    } 
})

//delete a todo
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        const timeDeletion = new Date();
        res.json({message: `Task has been deleted at : ${timeDeletion}`});

    } catch (err) {
        res.status(400).json({message: err});
    } 
})

module.exports = router;