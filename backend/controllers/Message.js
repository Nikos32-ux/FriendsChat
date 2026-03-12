import ConversationModel from "../models/Conversation.js";
import MessageModel from "../models/Messages.js";
import cloudinary from "../utils/Cloudinary.js";
import CustomError from "../utils/CustomError.js";
import handleError from "../utils/handleError.js";


export const SendMessage = async (req, res, next) => {
  const { message, receiverId, socketId } = req.body;

  const senderId = req.user;
  const file = req.file;

  const io = req.app.get("io");

  if (!message && !file) throw new CustomError("Message or file are required", 400);

  let result = null;

  if (req.file) {
    result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
      folder: "chat-images",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" }
      ]
    }
    )
  }

  const filePath = result?.secure_url;

  try {
    const newMessage = new MessageModel({
      userId: senderId,
      receiverId: receiverId,
      message: message || "",
      file: filePath || null,
    });

    const savedMessage = await newMessage.save();

    let conversation = await ConversationModel.findOne(
      { members: { $all: [senderId, receiverId] } }
    );

    if (conversation) {
      conversation = await ConversationModel.findByIdAndUpdate(
        { _id: conversation._id },
        { $push: { messages: savedMessage._id } }
      )
    } else {
      await ConversationModel.create({
        members: [senderId, receiverId],
        messages: [savedMessage._id]
      })
    }

    const populatedMessage = await MessageModel.findById(savedMessage._id)
      .populate("userId", "name profile")
      .populate("receiverId", "name profile");

    const messageObj = populatedMessage.toObject();
    messageObj._id = messageObj._id.toString();
    messageObj.userId._id = messageObj.userId._id.toString();
    messageObj.receiverId._id = messageObj.receiverId._id.toString();

    io.to(receiverId).emit("receive-message", { message: messageObj });
    if (socketId) {
      io.to(senderId).except(socketId).emit("receive-message", { message: messageObj })
    }


    res.status(200).json({
      success: true,
      data: messageObj,
    });

  }
  catch (error) {
    next(error);
  }
};



export const getMessages = async (req, res, next) => {
  const { receiverId } = req.body;
  const requestSender = req.user;

  if (!requestSender) throw new CustomError("No token valid", 401);
  if (!receiverId) throw new CustomError("Unknown receiver", 400);

  try {
    const conversation = await ConversationModel.findOne({
      members: { $all: [requestSender, receiverId] },
    }).populate({
      path: "messages",
      populate: { path: "userId", select: "name profile" },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      messages: conversation.messages
    });
  } catch (error) {
    next(error);
  }
};



export const toggleHeart = async (req, res, next) => {
  try {
    const { messageId } = req.body;
    const requestSender = req.user;
    const io = req.app.get("io");

    const msg = await MessageModel.findOne({ _id: messageId });
    if (!msg) throw new CustomError("Message Not found", 404);

    if (msg.userId.toString() != requestSender && msg.receiverId.toString() != requestSender) throw new CustomError("Invalid action", 403);

    msg.hearted = !msg.hearted;
    await msg.save();

    const msgToObj = msg.toObject();
    msgToObj._id = msgToObj._id.toString();
    msgToObj.userId = msgToObj.userId.toString();
    msgToObj.receiverId = msgToObj.receiverId.toString();

    const returnedMessage = {
      _id: msgToObj._id,
      userId: msgToObj.userId,
      receiverId: msgToObj.receiverId,
      hearted: msgToObj.hearted
    }

    io.to(msgToObj.receiverId).emit("receive-heart", { message: returnedMessage })
    io.to(msgToObj.userId).emit("receive-heart", { message: returnedMessage });

    res.status(200).json({
      success: true,
      message: returnedMessage
    });
  }
  catch (err) {
    next(err);
  }
}


export const editMessage = async (req, res, next) => {
  try {
    const { messageId, newText } = req.body;
    const requestSender = req.user;
    const io = req.app.get("io");

    const toBeUpdated = await MessageModel.findOne({ _id: messageId });
    if (toBeUpdated === null) throw new CustomError("Message not found", 404);
    if (toBeUpdated.userId.toString() !== requestSender) throw new CustomError("Invalid action", 403);

    toBeUpdated.edited = true;
    toBeUpdated.message = newText;
    await toBeUpdated.save();

    const toObj = toBeUpdated.toObject();

    const returnedUpdatedMsg = {
      _id: toObj._id.toString(),
      userId: toObj.userId.toString(),
      receiverId: toObj.receiverId.toString(),
      message: toObj.message,
      edited: toObj.edited,
      updatedAt: toObj.updatedAt
    };

    io.to(returnedUpdatedMsg.receiverId).emit("receive-edited-message", { updatedMessage: returnedUpdatedMsg })
    io.to(returnedUpdatedMsg.userId).emit("receive-edited-message", { updatedMessage: returnedUpdatedMsg })

    res.status(200).json({ success: true, updatedMessage: returnedUpdatedMsg })

  } catch (err) {
    next(err)
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { msgId } = req.body;
    const requestSender = req.user;
    const io = req.app.get("io");

    const messageToDelete = await MessageModel.findById(msgId);

    if (messageToDelete === null) throw new CustomError("Message not found", 404);
    if (messageToDelete.userId.toString() != requestSender) throw new CustomError("Invalid action", 403);

    messageToDelete.deleted = true;
    await messageToDelete.save();

    const returnDeletedMsg = messageToDelete.toObject();

    returnDeletedMsg._id = returnDeletedMsg._id.toString();
    returnDeletedMsg.userId = returnDeletedMsg.userId.toString();
    returnDeletedMsg.receiverId = returnDeletedMsg.receiverId.toString();

    io.to(requestSender).emit("receive-deleted-message", { deletedMessage: returnDeletedMsg })
    io.to(messageToDelete.receiverId.toString()).emit("receive-deleted-message", { deletedMessage: returnDeletedMsg })

    return res.status(200).json({ success: true, deletedMessage: messageToDelete });
  }
  catch (err) {
    next(err);
  }
}


export const setEmoji = async (req, res, next) => {
  try {
    const { messageId, emoji } = req.body;
    const requestSender = req.user;

    const io = req.app.get("io");

    const emojis = ["😀", "👍", "🤣", "😋", "🔥", "😢"];

    if (!emojis.includes(emoji)) throw new CustomError("Invalid emoji", 400)

    const messageForEmoji = await MessageModel.findById(messageId);
    if (messageForEmoji === null) throw new CustomError("Message Not found", 403);

    const isSender = messageForEmoji.userId.toString() === requestSender;
    const isReceiver = messageForEmoji.receiverId.toString() === requestSender;

    if (!isSender && !isReceiver) throw new CustomError("Invalid action", 403);

    messageForEmoji.icon = emoji;
    await messageForEmoji.save();

    const updatedMessageForEmoji = {
      _id: messageForEmoji._id.toString(),
      icon: messageForEmoji.icon,
      userId: messageForEmoji.userId.toString(),
      receiverId: messageForEmoji.receiverId.toString()
    }

    io.to(updatedMessageForEmoji.receiverId).emit("receive-emoji", { message: updatedMessageForEmoji })
    io.to(updatedMessageForEmoji.userId).emit("receive-emoji", { message: updatedMessageForEmoji })

    res.status(200).json({
      success: true,
      message: updatedMessageForEmoji
    })
  }
  catch (err) {
    next(err)
  }
}


export const handleLastMessages = async (req, res, next) => {
  try {
    const senderId = req.user;

    let conversations = await ConversationModel.find({ members: { $in: [senderId] } }).populate("messages");
    if (!conversations) {
      res.status(200).json({ success: true, conversations: [] })
    }

    
    res.status(200).json({ success: true, conversations: conversations });
  }
  catch (err) {
    next(err)
  }
}
