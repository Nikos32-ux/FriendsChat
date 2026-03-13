import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import api from "../../axiosConfig.js";
import { FaRegSmile } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { AuthContext } from "../context/AuthContext";
import { AiOutlineHeart, AiFillHeart, AiOutlineClose } from "react-icons/ai";
import { ChatContainerContext } from '../context/ChatContainerContext.jsx'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Message from "./Message/Message.jsx";
import '../index.css';
import { useChatListeners } from "../hook/useChatListeners.js";
import { useChatApi } from "../hook/useChatApi.js";
import { Header } from "./ChatcontainerUI/Header.jsx";
import { FormInput } from "./ChatcontainerUI/FormInput.jsx";
import { ChatMessages } from "./ChatcontainerUI/ChatMessages.jsx";


const ChatContainer = ({ selectedUser, setSelectedUser, currentUser, socket, lastMessages, setLastMessages, setsidebarIsTypingId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [closeTab, setCloseTab] = useState(null);

  const queryClient = useQueryClient();

  const { activeMessageId,
    setActiveMessageId,
    editingMessageId,
    setEditingMessageId,
    editingText,
    setEditingText,
    showDeleteId,
    setShowDeleteId,
    isTyping,
    isTextLong,
    setIsTextLong,
    setIsTyping,
    endOfMessagesRef,
    popUpRef,
    editRef,
    emojiRef,
    sendMessageInputRef
  } = useContext(ChatContainerContext);

  const { handleSendMessage, handleHeart, editMessage, deleteMsgId, handleEmojiIcon } = useChatApi(
    selectedUser,
    currentUser,
    socket,
    queryClient,
    api,
    newMessage,
    selectedFile,
    setNewMessage,
    setSelectedFile,
    setShowEmojiPicker,
    setPreview,
    setLastMessages
  );

  //Messages Input auto-resize
  useEffect(() => {
    const inputRef = sendMessageInputRef.current;
    if (!inputRef) return;
    inputRef.style.height = "auto";
    inputRef.style.height = inputRef.scrollHeight + "px";
  }, [newMessage]);


  //handle focus textarea
  useEffect(() => {
    if (editingMessageId && editRef.current) {
      editRef.current.focus();
    }
  }, [editingMessageId]);


  //  Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close bubble popup
      if (!e.target.closest("[data-msg-id]") || e.target.closest("[data-msg-id]").dataset.msgId !== activeMessageId) {
        setActiveMessageId(null);
        setShowDeleteId(null)
      }
      // Close emoji
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmojiPicker(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMessageId]);


  
  // Fetch messages with React Query
  const fetchMessages = async () => {
    if (!selectedUser) return [];
    try {
      const res = await api.post(
        "/api/messages/get_messages",
        { receiverId: selectedUser._id }
      );
      return res.data.messages;
    }
    catch (error) {
      console.error('Error occured: ', error.response?.data?.message)
      return [];
    }
  };

  const { data: fetchedMessages = [] } = useQuery({
    queryKey: ["messages", currentUser._id, selectedUser?._id],
    queryFn: fetchMessages,
    enabled: !!selectedUser,
  });

  //check unread messages on mount
  
  useEffect(() => {
    if (!selectedUser || fetchedMessages.length === 0) return;
    const lastFetchedMessage = fetchedMessages.at(-1);
    if (!lastFetchedMessage) {
      console.log("lastFetchedMessage doesnt exist");
      return;
    };
    console.log("lastFetchedMessage exists", lastFetchedMessage);
    const senderId = (lastFetchedMessage.userId._id || lastFetchedMessage.userId).toString();
    if (senderId !== currentUser._id.toString()) {
      socket.emit('send-read-message', { message: lastFetchedMessage });
    } 
  }, [selectedUser, fetchedMessages]);


  useEffect(() => {
    setCloseTab(null)
  }, [selectedUser]);

  // Socket events
  useChatListeners(selectedUser, currentUser, socket, queryClient, setsidebarIsTypingId, lastMessages, setLastMessages);


  //scroll to latest message automatically when opening conversation
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchedMessages, isTyping]);


  const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);
  const handleEmojiClick = (emojiData) => setNewMessage(prev => prev + emojiData.emoji);


  //handling preview of selected file before send it
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const closePreview = () => setPreview(null);

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden`}>
      {/* Chat header */}
      <Header
        closeTab={closeTab}
        setCloseTab={setCloseTab}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Messages list */}
      <ChatMessages
        fetchedMessages={fetchedMessages}
        currentUser={currentUser}
        handleHeart={handleHeart}
        editMessage={editMessage}
        deleteMsgId={deleteMsgId}
        handleEmojiIcon={handleEmojiIcon}
        AiOutlineHeart={AiOutlineHeart}
        AiOutlineClose={AiOutlineClose}
        AiFillHeart={AiFillHeart}
        FiTrash2={FiTrash2}
        isTyping={isTyping}
        endOfMessagesRef={endOfMessagesRef}
      />

      {/* Input */}
      
      <FormInput
        handleSendMessage={handleSendMessage}
        sendMessageInputRef={sendMessageInputRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        currentUser={currentUser}
        selectedUser={selectedUser}
        socket={socket}
        toggleEmojiPicker={toggleEmojiPicker}
        showEmojiPicker={showEmojiPicker}
        emojiRef={emojiRef}
        handleEmojiClick={handleEmojiClick}
        preview={preview}
        closePreview={closePreview}
        handleFileChange={handleFileChange}
        FaRegSmile={FaRegSmile}
      />
    </div>
  );
};

export default ChatContainer;
