const jwt = require('jsonwebtoken');
const jwtPassword = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decodedValue = jwt.verify(token, jwtPassword);
        if (decodedValue.username) {
            req.username = decodedValue.username;
            next();
        } else {
            res.status(403).json({
                msg: "You are not authenticated"
            })
        }
    } catch (e) {
        res.json({
            msg: "Incorrect token", error: e
        })
    }

}

module.exports = authMiddleware;