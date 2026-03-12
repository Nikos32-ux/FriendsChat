import dotenv from 'dotenv'
dotenv.config();
import UserModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import logger from '../utils/logger.js';
import handleError from "../utils/handleError.js";
import { generateToken } from "../utils/generateToken.js";
import { cookieSettings } from "../utils/cookieSettings.js";
import cloudinary from "../utils/Cloudinary.js";
import { fileTypeFromBuffer } from 'file-type';



export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) {
      throw new CustomError("Profile is required", 400);
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new CustomError("User already exists", 400);

    const file = req.file;
    const fileType = await fileTypeFromBuffer(file.buffer);

    let result = null;

    if (fileType.mime.startsWith("image/")) {
      result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "profiles",
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" }
          ]
        }
      );
    } else {
      throw new CustomError("Only images are accepted", 400);
    }

    const imagePath = result?.secure_url;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      profile: imagePath,
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true
    });
  }
  catch (error) {
    next(error);
  }
};


export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new CustomError("All fields are required", 401);

    const user = await UserModel.findOne({ email });
    if (!user) { throw new CustomError("User doesn't exist", 404) }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) throw new CustomError("Invalid credentials", 400);

    const token = generateToken(user);

    const userObj = user.toObject();
    userObj._id = userObj._id.toString();

    delete userObj.password;

    cookieSettings(token, res);

    res.status(200).json({
      success: true,
      message: "✅ User logged in successfully",
      user: userObj,
      token
    });
  } catch (error) {
    next(error);
  }
};



export const GetUser = async (req, res, next) => {
  try {
    const userid = req.user;
    const user = await UserModel.findById(userid).select("-password");
    if (!user) throw new CustomError("No user found", 401);

    res.status(200).json({ success: true, user: user });
  }
  catch (error) {
    next(error);
  }
};

export const Logout = (req, res, next) => {
  res.clearCookie("token", {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const AllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password");
    if (!users) throw new CustomError("Users not found", 400);

    let userList = [];
    for (let user of users) {
      let userObj = user.toObject();
      userObj._id = userObj._id.toString();
      userList.push(userObj);
    }

    res.status(200).json({ success: true, users: userList });
  }
  catch (error) {
    next(error);
  }
};

