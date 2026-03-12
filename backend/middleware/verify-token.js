import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import CustomError from '../utils/CustomError.js'
import handleError from '../utils/handleError.js'


const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    
    if(!token) throw new CustomError("No token available", 401);
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload.id;
        next();
    }catch(error){
       next(error);
    }
}

export default verifyToken