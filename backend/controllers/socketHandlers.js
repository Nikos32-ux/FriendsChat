import ConversationModel from "../models/Conversation.js";
import MessageModel from "../models/Messages.js";

export const handleRegisteredSockets = async (socket, onlineUsers, io, userId) => {
  //console.log("before ", socket.eventNames())

  socket.on("typing-start", ({ receiverId }) => {
    const senderId = socket.userId;
    if (onlineUsers.has(receiverId)) io.to(receiverId).emit("receive-typing-start", { senderId });
  });

  socket.on("typing-stop", ({ receiverId }) => {
    if (onlineUsers.has(receiverId)) {
      io.to(receiverId).emit("receive-typing-stop", { senderId: socket.userId });
    }
  });


  socket.on('send-read-message', async ({ message }) => {
    const senderId = message.userId._id || message.userId;
    const receiverId = message.receiverId._id || message.receiverId;

    await MessageModel.updateMany(
      { userId: senderId, receiverId: receiverId, read: false },
      { $set: { read: true, sidebarRead: true } }
    );

    if (onlineUsers.has(senderId)) io.to(senderId).emit('receive-read-message', { message });
  })

  socket.on("disconnect", () => {
    if (!userId) return;
    const rooms = io.sockets.adapter.rooms.get(userId);
    if (!rooms || rooms.size == 0) {
      onlineUsers.delete(userId);
    }
    io.emit("update-users", Array.from(onlineUsers));
  }
  )
  //console.log("After", socket.eventNames())
}
