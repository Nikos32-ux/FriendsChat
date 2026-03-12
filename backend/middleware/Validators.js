import { body } from 'express-validator';


export const sendMessageValidator = [
    body("receiverId")
        .notEmpty().withMessage(" ReceiverId cannot be empty")
        .isMongoId().withMessage("ReceiverId must have valid id format"),

    body("message")
        .optional({ checkFalsy: true })
        .isString().withMessage("Message must be text")
        .trim()
        .escape()
        .isLength({ max: 500 }).withMessage("Message too long")
]


export const toggledHeartValidator = [
    body("messageId")
        .isMongoId().withMessage("message id must be valid id format")
]

export const editMsgValidator = [
    body("messageId")
        .isMongoId().withMessage("Must be valid id format"),

    body("newText")
        .isString().withMessage("Must be text")
        .trim()
        .escape()
        .isLength({ max: 500 }).withMessage("Message too long")
]


export const deleteMsgIdValidator = [
    body("msgId")
        .isMongoId().withMessage("Must be valid id format")
]



export const emojiValidator = [
    body("messageId")
        .isMongoId().withMessage("Must be valid id format")
]


export const userRegisterValidator = [
    body("name")
        .notEmpty().withMessage("Name id required")
        .isString().withMessage("Must be text")
        .trim()
        .escape()
        .isLength({min: 2, max: 20}).withMessage("Name must be 2-20 characters"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("must have valid email format")
        .trim()
        .normalizeEmail(),
    
    body("password")
        .isString().withMessage("Must be string")
        .notEmpty().withMessage("Password is required")
        .custom((value) => {
            if(value.trim().length === 0){
                throw new Error("Password cannot be spaces")  
            }
            return true;
        })
        .isLength({ min:6, max: 25}).withMessage("Password must be 6-25 characters")
]


export const loginValidator = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must have valid email format")
        .trim()
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Invalid Password format")
        
]