import express from 'express'
import { upload } from '../middleware/Multer.js'
import { Register, Logout, Login, GetUser, AllUsers } from '../controllers/Auth.js'
import verifyToken from '../middleware/verify-token.js';
import { validate } from '../middleware/Validate.js';
import { loginValidator, userRegisterValidator } from '../middleware/Validators.js'

const AuthRoutes = express.Router();

AuthRoutes.post('/register', upload.single('profile'), userRegisterValidator, validate, Register)
AuthRoutes.post('/login', loginValidator, validate, Login)
AuthRoutes.get('/get_user', verifyToken, GetUser)
AuthRoutes.post('/logout', Logout)
AuthRoutes.get("/all_users", AllUsers);

export default AuthRoutes