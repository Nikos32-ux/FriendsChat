import { ChatContainerContext } from '../../context/ChatContainerContext.jsx';
import { React, useContext, useEffect, useRef, useState } from 'react';
import SenderHeart from './SenderHeart.jsx';
import ReceiverHeart from './ReceiverHeart.jsx';
import EditBubble from './Bubble/EditBubble.jsx';
import DeleteBubble from './Bubble/DeleteBubble.jsx';
import MessageBubble from './Bubble/MessageBubble.jsx';





const Message = ({ msg, isOwn, read, handleHeart, editMessage, deleteMsgId, handleEmojiIcon,  AiOutlineHeart, AiFillHeart, AiOutlineClose, FiTrash2 }) => {
  
  const { activeMessageId,
    setActiveMessageId,
    editingMessageId,
    setEditingMessageId,
    editingText,
    setEditingText,
    showDeleteId,
    setShowDeleteId,
    isTyping,
    setIsTyping,
    messagesEndRef,
    trashIconRef,
    popUpRef,
    editRef,
    sendMessageInputRef
  } = useContext(ChatContainerContext)


  const handleDeleteMesssage = (msgId) => {
     deleteMsgId(msg._id);
  }

  return (
    <div onClick={(e) => {
      const bubble = e.target.closest("[data-msg-id]");
      if (bubble) {
        const msgId = bubble.dataset.msgId;
        setActiveMessageId(prev => prev === msgId ? null : msgId)
      } else {    
        setActiveMessageId(null)
      }
    }}
     className={`relative m-5 flex gap-5 ${isOwn ? "justify-end" : "justify-start"} items-center cursor-pointer`}
    >
      {/* For isOwn: heart displayed on left */}
      {isOwn && (
        <SenderHeart 
          handleHeart={handleHeart}
          msg={msg}
          AiFillHeart={AiFillHeart}
          AiOutlineHeart={AiOutlineHeart}
        />
      )}

      {/* Main content */}
      {editingMessageId === msg._id ?
       (
        <EditBubble
          isOwn={isOwn}
          msg={msg}
          editMessage={editMessage}
        />
      ) 
      : msg.deleted ?
       (
        <DeleteBubble AiOutlineClose={AiOutlineClose}/>
      ) 
      : (
        /* Bubble message container */   
        <MessageBubble 
          isOwn={isOwn}
          showDeleteId={showDeleteId}
          handleEmojiIcon={handleEmojiIcon}
          msg={msg}
          read={read}
          activeMessageId={activeMessageId}
          setEditingMessageId={() => setEditingMessageId(msg._id)}
          setEditingText={() => setEditingText(msg.message)}
          handleDeleteMesssage={() => handleDeleteMesssage(msg._id)}
          deleteMsgId={deleteMsgId}
        />
      )
      }

      {/* For !isOwn: heart displayed on right */}
      {!isOwn && (
        <ReceiverHeart 
          handleHeart={handleHeart}
          msg={msg}
          AiFillHeart={AiFillHeart}
          AiOutlineHeart={AiOutlineHeart}
        />
      )}
    </div>
  )
}

export default Message
