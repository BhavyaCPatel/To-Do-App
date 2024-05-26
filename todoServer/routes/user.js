const { Router } = require("express");
const authMiddleware = require("../middleware/auth");
const { User, Todo } = require("../db");
const zod = require('zod')
const router = Router();
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken');
jwtSecret = process.env.JWT_SECRET;

let usernameSchema = zod.string()
let emailSchema = zod.string().email()
let passwordSchema = zod.string().min(6)

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const usernameRes = usernameSchema.safeParse(username);
        const emailRes = emailSchema.safeParse(email);
        const passwordRes = passwordSchema.safeParse(password);

        if (!usernameRes.success || !emailRes.success || !passwordRes.success) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.create({ username, email, password: hashedPassword });

        if (response) {
            res.json({ message: 'User created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1d' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/todos/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
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

router.put('/profile/:userId', authMiddleware, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            const usernameRes = usernameSchema.safeParse(username);
            if (!usernameRes.success) {
                return res.status(400).json({ message: 'Invalid username' });
            }
            user.username = username;
        }

        if (email) {
            const emailRes = emailSchema.safeParse(email);
            if (!emailRes.success) {
                return res.status(400).json({ message: 'Invalid email' });
            }
            user.email = email;
        }

        if (password) {
            const passwordRes = passwordSchema.safeParse(password);
            if (!passwordRes.success) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
