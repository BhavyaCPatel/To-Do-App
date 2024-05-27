const { Router } = require("express");
const authMiddleware = require("../middleware/auth");
const { User, Todo } = require("../db");
const zod = require('zod');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = Router();

const jwtSecret = process.env.JWT_SECRET;

const usernameSchema = zod.string();
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!usernameSchema.safeParse(username).success ||
            !emailSchema.safeParse(email).success ||
            !passwordSchema.safeParse(password).success) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.create({ username, email, password: hashedPassword });

        if (response) {
            return res.json({ message: 'User created successfully', userId: response._id });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '30d' });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get User Details
router.get('/details', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get User Todos
router.get('/todos', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const todos = await Todo.find({ user: userId });
        res.json({ todos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username && !usernameSchema.safeParse(username).success) {
            return res.status(400).json({ message: 'Invalid username' });
        }
        if (email && !emailSchema.safeParse(email).success) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        if (password && !passwordSchema.safeParse(password).success) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        const updatedUser = await user.save();
        res.json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
