import jwt from 'jsonwebtoken';


export const generateToken = (userId) => {
       const token = jwt.sign(
          { id: userId._id.toString()},
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        )    
    return token;
}
