const { Router } = require("express");
const userMiddleware = require("../middleware/auth");
const { User, Todo } = require("../db");
const router = Router();
const authMiddleware = require("../middleware/auth");


router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }
        const todo = await Todo.create({ title, description, dueDate, user: user._id });

        await User.findByIdAndUpdate(user._id, { $push: { todos: todo._id } });

        res.json({ todo });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
})

router.get('/all', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }
        const todos = await Todo.find({ user: user._id });
        res.json({ todos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update/:todoId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }
        const { title, description, dueDate, completed } = req.body;
        const todoId = req.params.todoId;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (title) {
            todo.title = title;
        }
        if (description) {
            todo.description = description;
        }
        if (dueDate) {
            todo.dueDate = dueDate;
        }
        if (completed) {
            todo.completed = completed;
        }

        const updatedTodo = await todo.save();
        await User.findByIdAndUpdate(user._id, { $set: { todos: todo._id } });
        res.json({ message: 'Todo updated successfully', todo: updatedTodo });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
});

router.delete('/delete/:todoId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }
        const todoId = req.params.todoId;
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await Todo.findByIdAndDelete(todoId);
        await User.findByIdAndUpdate(user._id, { $unset: { todos: todo._id } });
        res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
})

module.exports = router;