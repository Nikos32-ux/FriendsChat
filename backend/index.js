  import { config } from "dotenv";
  config();
  import express from "express";
  import http from "http";
  import { Server } from "socket.io";
  import mongoose from "mongoose";
  import cors from "cors";
  import cookieParser from "cookie-parser";
  import MessageRoutes from "./routes/Messages.js";
  import AuthRoutes from "./routes/Auth.js";
  import { connectToDB } from "./utils/db.js";
  import { deleteMessage } from "./controllers/Message.js";
  import ConversationModel from "./models/Conversation.js";
  import MessageModel from "./models/Messages.js";
  import verifyToken from "./middleware/verify-token.js";
  import handleError from "./utils/handleError.js";
  import CustomError from "./utils/CustomError.js";
  import jwt from 'jsonwebtoken'
  import { handleRegisteredSockets } from "./controllers/socketHandlers.js";



  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"]
    },
    transports: ["websocket", "polling"]
  });


  io.use((socket, next) => {
    try {
    
      let token = socket.handshake.headers?.cookie;
      if (!token) throw new CustomError("No token found", 401);
      
      token = token.split("=")[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    }
    catch (err) {
      next(err);
    }
  })


  let onlineUsers = new Set();

  io.on("connection", (socket) => {
    const userId = socket.userId;
    socket.join(userId);

    onlineUsers.add(userId);
    
    socket.on("users-online-list",()=>{
      socket.emit("update-users-list", Array.from(onlineUsers));
    })
    
    handleRegisteredSockets(socket, onlineUsers, io, userId);
  });

  // Middlewares
  app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
  }));

  app.use(express.json());
  app.use(express.static("public"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/auth", AuthRoutes);
  app.use("/api/messages", verifyToken, MessageRoutes);

  app.set("io", io);

  app.use((err, req, res, next) => {
    handleError(err, res);
  })


  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToDB();
  });
