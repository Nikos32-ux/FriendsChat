import React from "react";
import Message from "../Message/Message";

export const ChatMessages = ({
    fetchedMessages,
        currentUser,
        handleHeart,
        editMessage,
        deleteMsgId,
        handleEmojiIcon,
        AiOutlineHeart,
        AiOutlineClose,
        AiFillHeart,
        FiTrash2,
        isTyping,
        endOfMessagesRef
}) => {
    return(
        <div className="flex-1 overflow-y-auto bg-white text-white py-5 px-8 space-y-2 relative ">
        {
          fetchedMessages.map((msg, idx) => {
            const isOwn = msg.userId?._id === currentUser._id;
            const read = isOwn && msg.read;

            return (
              <Message
                key={msg._id || idx}
                isOwn={isOwn}
                read={read}
                msg={msg}
                handleHeart={() => handleHeart(msg._id)}
                editMessage={ editMessage}
                deleteMsgId={() => deleteMsgId(msg._id)}
                handleEmojiIcon={handleEmojiIcon}
                AiOutlineHeart={AiOutlineHeart}
                AiOutlineClose={AiOutlineClose}
                AiFillHeart={AiFillHeart}
                FiTrash2={FiTrash2}
              />
            );
          })
        }
        {isTyping && (<div className="p-2 text-sm text-gray-800 italic">Typing...</div>)}
        <div ref={endOfMessagesRef} />
      </div>
    )
}