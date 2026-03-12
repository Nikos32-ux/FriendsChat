import { createContext, useState, useEffect, useRef } from "react";

export const ChatContainerContext = createContext();

export const ChatProvider = ({children}) => {
    const [activeMessageId, setActiveMessageId] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [showDeleteId, setShowDeleteId] = useState(null)
    const [isTyping, setIsTyping] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(null)
    const endOfMessagesRef = useRef();
    const popUpRef = useRef();
    const editRef = useRef()
    const trashIconRef = useRef();
    const emojiRef = useRef()
    const sendMessageInputRef = useRef(null);
    const [isTextLong, setIsTextLong] = useState(false);
    const [isBeingSend, setIsBeingSend] = useState(false);

    const chatcontextValues = {
            activeMessageId, 
            setActiveMessageId,
            editingMessageId,
            setEditingMessageId,
            editingText,
            isBeingSend,
            setIsBeingSend,
            setEditingText,
            showDeleteId,
            setShowDeleteId,
            isTyping,
            isTextLong,
            setIsTextLong,
            setIsTyping,
            deleteWarning,
            setDeleteWarning,
            endOfMessagesRef,
            popUpRef,
            trashIconRef,
            editRef,
            emojiRef,
            sendMessageInputRef
    }
    return (
        <ChatContainerContext.Provider value = {chatcontextValues}>
            {children}
        </ChatContainerContext.Provider>
    )
  }

