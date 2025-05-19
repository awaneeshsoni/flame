import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"

configDotenv();
const authMiddleware = async (req, res, next) => {
    let token = req.get('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied M' });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(token)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;