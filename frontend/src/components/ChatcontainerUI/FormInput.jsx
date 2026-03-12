import React, { useCallback, useContext } from "react";
import { useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { debounce } from "lodash";
import { ChatContainerContext } from "../../context/ChatContainerContext";
import { useState } from "react";

export const FormInput = ({
    handleSendMessage,
    sendMessageInputRef,
    newMessage,
    setNewMessage,
    currentUser,
    selectedUser,
    socket,
    toggleEmojiPicker,
    showEmojiPicker,
    emojiRef,
    handleEmojiClick,
    preview,
    closePreview,
    handleFileChange,
    FaRegSmile
}) => {

    const { isTextLong, isBeingSend } = useContext(ChatContainerContext)


    const emitTyping = (value) => {
        value
            ? socket.emit("typing-start", { receiverId: selectedUser._id })
            : socket.emit('typing-stop', { receiverId: selectedUser._id })
    }

    const debouncedTyping = useCallback(
        debounce(emitTyping, 500),
        [socket, currentUser._id, selectedUser?._id]
    );

    const handleTypingEffect = (e) => {
        setNewMessage(e.target.value);
        debouncedTyping(e.target.value);
    }


    useEffect(() => {
        return () => debouncedTyping.cancel();
    }, [debouncedTyping])

    return (
        <div className="w-full">
            {isTextLong && (
                <div className="bg-red-500"><h1>Message cannot be so long</h1></div>
            )}

            <form onSubmit={handleSendMessage} className="p-2 w-full border-gray-700 bg-gray-900 border-t flex gap-1 items-end relative">
                <textarea
                    ref={sendMessageInputRef}
                    type="text"
                    value={newMessage}
                    rows={1}
                    onChange={(e) => handleTypingEffect(e)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 max-h-40 border rounded-lg focus:outline-none resize-none focus:ring focus:ring-blue-300 bg-gray-800 text-white border border-gray-700 relative"
                />
                <div className="flex w-[30%] justify-around">
                    <button type="button" className="bg-blue-400/10 rounded-sm p-1" onClick={toggleEmojiPicker}>
                        <FaRegSmile className="w-8 h-7 text-gray-500 hover:text-white font-bold" />
                    </button>
                    
                        {
                            showEmojiPicker && (
                                <div ref={emojiRef} className="absolute bottom-14 left-2 z-50">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )
                        }
        

                    <label htmlFor="fileUpload" className="cursor-pointer px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">📎</label>
                    {
                        preview && (
                            <div className="relative mb-2 p-2 bg-gray-300 border-gray">
                                <img src={preview} alt="preview" className="max-w-[150px] max-h-[150px] rounded" />
                                <span onClick={closePreview} className="absolute -top-2 cursor-pointer -right-1 py-0 text-xl">x</span>
                            </div>
                        )
                    }
                    <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
                    <button disabled={isBeingSend ? true : false} type="submit" className={`p-2 ${!isBeingSend ? "bg-blue-500" : "bg-gray-300/10 text-white"} text-white rounded-lg w-[80px]`}>Send</button>
                </div>

            </form>
        </div>
    )
}