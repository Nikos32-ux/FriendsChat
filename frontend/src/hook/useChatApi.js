import React, { useContext } from "react";
import { ChatContainerContext } from "../context/ChatContainerContext";
const sendAudio = new Audio("/sendMessage.mp3");
const heartClickAudio = new Audio("/clickHeart.mp3");

export const useChatApi = (selectedUser, currentUser, socket, queryClient, api, newMessage, selectedFile, setNewMessage, setSelectedFile, setShowEmojiPicker, setPreview, setLastMessages) => {

  const {
    setActiveMessageId,
    setEditingMessageId,
    setEditingText,
    isTextLong,
    isBeingSend,
    setIsBeingSend,
    setIsTextLong
  } = useContext(ChatContainerContext);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setIsBeingSend(true);

    if (newMessage.length > 500) {
      setIsTextLong(true);
      setTimeout(() => {
        setIsTextLong(false);
      }, 2000)
      return;
    }

    const formData = new FormData();
    formData.append("socketId", socket.id);
    formData.append("receiverId", selectedUser._id);
    if (newMessage.trim()) formData.append("message", newMessage.trim());
    if (selectedFile) formData.append("file", selectedFile);


    try {
      const res = await api.post("/api/messages/send_message", formData);
      if (res.data.success) {
        const savedMessage = { ...res.data.data };


        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser._id],
          (old = []) => {
            const messageExists = old.some(msg => msg.id === savedMessage._id);
            return messageExists ? old : [...old, savedMessage];
          }
        );

        setLastMessages(prev => (
          { ...prev, [savedMessage.receiverId._id]: { ...prev[savedMessage.receiverId._id], userId: savedMessage.userId._id, message: savedMessage.message, bold: false, sidebarRead: false } }
        ))

        sendAudio.play();

        setNewMessage("");
        setSelectedFile(null);
        setShowEmojiPicker(false);
        setPreview(null);

        socket.emit("typing-stop", { senderId: currentUser._id, receiverId: selectedUser._id });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    finally {
      setIsBeingSend(false);
    }
  };

  const handleHeart = async (messageId) => {
    try {

      const res = await api.post('/api/messages/toggle-heart', { messageId });

      if (res.data.success) {
        const toggledHeartedMsg = res.data.message;
        const toggledHeartMessageId = toggledHeartedMsg._id;

        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser._id],
          (old = []) => old.map(msg => msg._id === toggledHeartMessageId ? { ...msg, hearted: res.data.message.hearted } : msg)
        )
        heartClickAudio.play();
      }

    }
    catch (err) {
      console.error("Error occured", err);
    }
  };

  const editMessage = async (newText, messageId) => {
    try {
      const res = await api.post("/api/messages/edit-message", { newText, messageId })
      if (res.data.success) {
        const updatedMessage = res.data.updatedMessage;

        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser?._id],
          (old = []) => old.map(
            msg => msg._id === updatedMessage._id
              ? { ...msg, message: updatedMessage.message, edited: updatedMessage.edited, updatedAt: updatedMessage.updatedAt }
              : msg
          )
        )

        setEditingMessageId(null)
        // setEditingText("")

        socket.emit('send-editedMsg', { message: updatedMessage })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteMsgId = async (msgId) => {
    try {
      const res = await api.post('/api/messages/delete-message', { msgId })
      if (res.data.success) {
        const deletedMessage = res.data.deletedMessage;
        console.log("deleted msg", deletedMessage);


        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser?._id],
          (old = []) => old.map(
            msg => msg._id === deletedMessage._id
              ? { ...msg, deleted: deletedMessage.deleted }
              : msg
          )
        )
      }
    }
    catch (err) {
      console.error('Error happened: ', err.response?.data.message);
    }
  }


  const handleEmojiIcon = async (msgId, emojiIcon) => {
    try {
      const res = await api.post('/api/messages/set-emoji', { messageId: msgId, emoji: emojiIcon })

      if (res.data.success) {
        const updatedEmojiMessage = res.data.message;


        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser?._id],
          (old = []) => old.map(msg =>
            msg._id === updatedEmojiMessage._id.toString()
              ? { ...msg, icon: updatedEmojiMessage.icon }
              : msg
          )
        )
        setActiveMessageId(null);
      }
    }
    catch (err) {
      console.log('failed to send the emoji,reason :', err)
    }
  }
  return {
    handleSendMessage,
    handleHeart,
    editMessage,
    deleteMsgId,
    handleEmojiIcon
  };
}