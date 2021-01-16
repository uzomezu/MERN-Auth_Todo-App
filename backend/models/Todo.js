const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {type: String},

},
{
    timestamps: true,
})

const todoSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: {type: String, required: true},
    complete: {type: Boolean, default: false},
    comments: [commentSchema]
},
{
    timestamps: true,
});


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;