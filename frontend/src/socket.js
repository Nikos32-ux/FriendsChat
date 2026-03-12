// src/socket.js
import { io } from "socket.io-client";


const socket = io(
  import.meta.env.VITE_API_URL || "https://thechatapp-ppoz.onrender.com",
  {
    withCredentials: true,
    transports:["websocket","polling"]
  }
);

export default socket;
