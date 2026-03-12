import React, { useContext } from "react";
import { ChatContainerContext } from "../../../context/ChatContainerContext";

const MessageBubble = ({isOwn, showDeleteId, msg, read, activeMessageId, handleEmojiIcon, setEditingMessageId, setEditingText, handleDeleteMesssage}) => {

      const {endOfMessagesRef} = useContext(ChatContainerContext);
      const emojiContainer = [
        { id: 1, name: "heart", emoji: "❤️" },
        { id: 2, name: "smile1", emoji: "😀" },
        { id: 3, name: "smile2", emoji: "👍" },
        { id: 4, name: "smile3", emoji: "🤣" },
        { id: 5, name: "smile4", emoji: "😋" },
        { id: 5, name: "smile4", emoji: "🔥" },
        { id: 5, name: "smile4", emoji: "😢" }
      ];


    return(
        <div className="relative flex flex-col min-w-0 max-w-[400px]">       
          <div 
            data-msg-id={msg._id} 
            className={`p-2 ${showDeleteId === msg._id ? "active:scale-125 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : ""} flex flex-col rounded-lg ${isOwn ? "bg-[rgba(217,238,255,0.85)] text-black" : "bg-[rgba(240,240,240,0.9)] text-black"}`}>
        
            
            {msg.message && <span className='break-words'>{msg.message}</span>}
            {msg.file && (
              <img
                src={msg.file}
                className="mt-1 max-w-full rounded"
                alt="attachment"
                onLoad={() =>
                  endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              />
            )}
            <div className="flex justify-end items-center">
              <span className="text-xs">{msg.edited ? ("Εγινε επεξεργασια " + new Date(msg.updatedAt).toLocaleTimeString()) : new Date(msg.createdAt).toLocaleTimeString()}</span>
              {isOwn && <span className={`ml-2 text-xs ${read ? "text-[rgba(158,10,42,0.82)]" : "text-[rgba(110,111,121,0.82)]"}`}>✓✓</span>}
            </div>
            {/* Bubble popup */}
            {activeMessageId === msg._id && (
              <div onClick={(e) => 
                  e.stopPropagation()} 
                  style={{ transform: "translateY(-100%)" }} 
                  className={`absolute top-0 ${isOwn ? "right-0" : "left-0"} bottom-full z-50`}>
                <div className="rounded-lg shadow-lg min-w-[160px]">
                  <div className="flex mb-2 bg-white shadow-xlg rounded-full py-0 px-6 z-40">
                    {
                    emojiContainer.map((emoji) => (
                      <span onClick={() => handleEmojiIcon(msg._id, emoji.emoji)} key={emoji.id} className="m-2">
                        {emoji.emoji}
                      </span>
                    ))
                    }
                  </div>
                  <div className="absolute right-0 bg-white z-40 w-[50%] flex px-2 justify-center flex-col gap-2 py-5 rounded-lg h-[120px]">
                    <p onClick={(e) => {                
                        setEditingMessageId(msg._id);
                        setEditingText(msg.message);                    
                      }}
                      className="cursor-pointer text-gray-700 hover:bg-gray-200 w-full rounded-sm">
                      Edit
                    </p>
                    <p onClick={handleDeleteMesssage} className="cursor-pointer text-gray-700 hover:bg-gray-200 w-full rounded-sm">
                      Delete
                    </p>                                  
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    )
}

export default MessageBubble;