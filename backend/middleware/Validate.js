import {validationResult} from 'express-validator';
import CustomError from '../utils/CustomError.js';


export const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log("VALIDATION ERRORS", errors.array());
        
        throw new CustomError(errors.array()[0].msg, 400);
    }
    next();
}