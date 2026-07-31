import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if ( !token ) {
        return res.status(401).json({ msg : "Token manquant" })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {

        if (err) return res.status(403).json({ message: "Token invalide" });

        req.user = user;
        
        next();
    });
}

export default authenticateToken