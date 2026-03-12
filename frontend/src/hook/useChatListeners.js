import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { ChatContainerContext } from "../context/ChatContainerContext";
import { preconnect } from "react-dom";
import Sidebar from "../components/Sidebar";
const receiveAudio = new Audio("/notify.mp3");


export const useChatListeners = (selectedUser, currentUser, socket, queryClient, setsidebarIsTypingId, lastMessages, setLastMessages) => {
  const { setIsTyping } = useContext(ChatContainerContext);

  useEffect(() => {
    if (!selectedUser) return;
   
    const handleReceiveMessage = ({ message }) => {
      const senderId = (message.userId._id || message.userId).toString();
      const receiverId = (message.receiverId._id || message.receiverId).toString();

      queryClient.setQueryData(
        ["messages", currentUser._id, selectedUser?._id],
        (old = []) => old.map(msg => (msg.userId._id || msg.userId).toString() === currentUser._id.toString() ? { ...msg, read: true } : msg)
      );
      setLastMessages(prev => ({ ...prev, [receiverId]: { ...prev[receiverId], sidebarRead: true } }))
    };


    //socket for handle edit message
    const handleEditedIncoming = ({ updatedMessage }) => {
      const isSamePerson = updatedMessage.userId === currentUser._id.toString() ? true : false;

      if (isSamePerson) {
        if (updatedMessage.receiverId !== selectedUser._id.toString()) return;
      }

      if (!isSamePerson && updatedMessage.userId !== selectedUser._id.toString()) return;

      queryClient.setQueryData(
        ["messages", currentUser._id, selectedUser?._id],
        (old = []) => {
          return old.map(msg =>
            msg._id === updatedMessage._id
              ? { ...msg, message: updatedMessage.message, edited: updatedMessage.edited, updatedAt: updatedMessage.updatedAt }
              : msg
          )
        }
      )
    }

    //socket for clicking heart icon 
    const handleReceiverHeart = ({ message }) => {

      const isSamePerson = message.userId === currentUser._id.toString() ? true : false; 

      if (isSamePerson) {
        if (message.receiverId !== selectedUser._id.toString()) return;
      }

      if (!isSamePerson && message.userId !== selectedUser._id.toString()) return;

      const messageId = message._id;
      queryClient.setQueryData(
        ["messages", currentUser._id, selectedUser._id],
        (old = []) => old.map(msg => msg._id === messageId ? { ...msg, hearted: message.hearted } : msg)
      );
    };

    //socket for deleting message
    const handleDeleteMesssage = ({ deletedMessage }) => {
      const isSamePerson = deletedMessage.userId === currentUser._id.toString() ? true : false; //true

      if (isSamePerson) {
        if (deletedMessage.receiverId !== selectedUser._id.toString()) return;
      }

      if (!isSamePerson && deletedMessage.userId !== selectedUser._id.toString()) return;

      queryClient.setQueryData(
        ["messages", currentUser._id, selectedUser?._id],
        (old = []) => old.map(msg => msg._id === deletedMessage._id ? { ...msg, deleted: true } : msg)
      )
    }

    //socket for choosing emoji
    const handleReceiveEmoji = ({ message }) => {
      const isSamePerson = message.userId === currentUser._id.toString() ? true : false; //true

      if (isSamePerson) {
        if (message.receiverId !== selectedUser._id.toString()) return;
      }

      if (!isSamePerson && message.userId !== selectedUser._id.toString()) return;
      
      queryClient.setQueryData(
        ["messages", currentUser._id, selectedUser?._id],
        (old = []) => old.map(msg =>
          msg._id === message._id
            ? { ...msg, icon: message.icon }
            : msg
        )
      )
    }


    socket.on("receive-edited-message", handleEditedIncoming);
    socket.on("receive-read-message", handleReceiveMessage);
    socket.on("receive-heart", handleReceiverHeart);
    socket.on('receive-deleted-message', handleDeleteMesssage)
    socket.on('receive-emoji', handleReceiveEmoji)

    return () => {
      socket.off("receive-read-message", handleReceiveMessage);
      socket.off("receive-heart", handleReceiverHeart);
      socket.off("receive-edited-message", handleEditedIncoming);
      socket.off('receive-deleted-message', handleDeleteMesssage);
      socket.off('receive-emoji', handleReceiveEmoji);

    };
  }, [selectedUser, currentUser, socket, queryClient]);


  useEffect(() => {
    //socket for handling typing effect-start
    const handleTypingStart = ({ senderId }) => {
      if (selectedUser && selectedUser?._id === senderId) {
        setIsTyping(true);
      } else if (!selectedUser || selectedUser?._id !== senderId) {
        setsidebarIsTypingId(senderId);
      }
    };

    //socket for handle typing effect-stop
    const handleTypingStop = ({ senderId }) => {
      selectedUser?._id === senderId ? setIsTyping(false) : setsidebarIsTypingId(null)
    };
    socket.on("receive-typing-stop", handleTypingStop);
    socket.on("receive-typing-start", handleTypingStart);

    return () => {
      socket.off("receive-typing-start", handleTypingStart);
      socket.off("receive-typing-stop", handleTypingStop);
    }
  }, [selectedUser]);

  useEffect(() => { 
    const handleIncomingMessage = async ({ message }) => {
      const senderId = (message.userId._id || message.userId).toString();
      const receiverId = (message.receiverId._id || message.receiverId).toString();

      const sidebarUser = senderId === currentUser._id.toString() ? receiverId : senderId;

      if (!selectedUser || selectedUser?._id.toString() !== sidebarUser) {
        setLastMessages(prev => ({
          ...prev,
          [sidebarUser]: {
            ...prev[sidebarUser],
            message: message.message,
            userId: sidebarUser,
            bold: sidebarUser === senderId ? true : false,
            sidebarRead: false,
            filteredCount: sidebarUser === senderId ? (prev[sidebarUser]?.filteredCount || 0) + 1 : 0
          }
        }));
      }

      else if (selectedUser?._id.toString() === sidebarUser) {
        queryClient.setQueryData(
          ["messages", currentUser._id, selectedUser?._id],
          (old = []) => [...old, message]
        )
        setLastMessages(prev => ({ ...prev, [sidebarUser]: { ...prev[sidebarUser], message: message.message, userId: senderId, bold: false } }));

        if (sidebarUser === senderId) {
          socket.emit('send-read-message', { message })
        }
      }

      receiveAudio.play().catch(() => { });
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage)
    }
  }, [socket, queryClient, selectedUser, currentUser]);
}