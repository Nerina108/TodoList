// Import Models
const Todo = require('../models/todo.model');
const User = require('../models/user.model');

//View existing todos upon successful login
const viewTodos = (req, res) => {
    const loggedInUser = req.user._id;

    User.findById(loggedInUser).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to fetch todos'
            })
        }

        return res.json({
            todos: user.todos
        })
    })
}

//create new todo and save to profile
const createTodo = (req, res) => {
    const user = req.user._id;
    const todo = new Todo({ user, todo: req.body.todo });

    // Save new todo
    todo.save();

    User.findById(user).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to add todo'
            })
        }

        // Data represents a User object
        data.todos.push(todo);
        // Save the updated user with the new todo
        data.save();

        return res.status(200).json({
            message: 'Todo added!',
            data
        })
    })
}


//delete todo from profile
const deleteTodo = (req, res) => {
    const { _id } = req.params;

    Todo.findByIdAndDelete(_id).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to delete todo'
            })
        }

        return res.status(201).json({
            message: 'Todo deleted!'
        })
    })
}


// Export Controllers
module.exports = {
    viewTodos,
    createTodo,
    deleteTodo
}