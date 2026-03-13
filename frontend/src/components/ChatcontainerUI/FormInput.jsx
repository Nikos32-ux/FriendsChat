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
        <div className="w-full flex flex-col ">
            {
                preview && (
                    <div className="mx-2 mb-2 p-2 border border-gray-700 self-start">
                        <img src={preview} alt="preview" className="max-w-[120px] max-h-[80px] object-cover " />
                        <span onClick={closePreview} className="cursor-pointer text-white ml-2">x</span>
                    </div>
                )
            }
            {isTextLong && (
                <div className="bg-red-500"><h1>Message cannot be so long</h1></div>
            )}

            <form onSubmit={handleSendMessage} className=" px-2 py-2 w-full border-gray-700 border-t flex items-end  relative">
                <textarea
                    ref={sendMessageInputRef}
                    type="text"
                    value={newMessage}
                    rows={1}
                    onChange={(e) => handleTypingEffect(e)}
                    placeholder="Type a message..."
                    className=" flex-1 min-w-[50px] p-2 border rounded-lg focus:outline-none resize-none focus:ring focus:ring-blue-300 bg-gray-800 text-white border border-gray-700 "
                />
                <div className="flex items-center gap-1 shrink-0 ">
                    <button type="button" className="bg-blue-400/10 rounded-sm p-1" onClick={toggleEmojiPicker}>
                        <FaRegSmile className="w-8 h-8 text-gray-500 hover:text-white font-bold" />
                    </button>

                    {
                        showEmojiPicker && (
                            <div ref={emojiRef} className="absolute bottom-14 left-2 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )
                    }


                    <label htmlFor="fileUpload" className="cursor-pointer p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        📎
                    </label>
                    <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
                    <button disabled={isBeingSend ? true : false} type="submit" className={`p-2 ${!isBeingSend ? "bg-blue-500" : "bg-gray-300/10 text-white"} text-white rounded-lg min-w-[60px]`}>Send</button>
                </div>

            </form>
        </div>
    )
}