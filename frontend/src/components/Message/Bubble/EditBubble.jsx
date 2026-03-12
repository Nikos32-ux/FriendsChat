import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { ChatContainerContext } from "../../../context/ChatContainerContext";


const EditBubble = ({isOwn, msg, editMessage}) => {
  
  const {editRef, editingText, setEditingText, setActiveMessageId, setEditingMessageId} = useContext(ChatContainerContext);

   useEffect(()=>{
    const editingRefcurrent = editRef.current;
    if(!editingRefcurrent) return;

    editingRefcurrent.style.height = "auto";
    editingRefcurrent.style.height = editingRefcurrent.scrollHeight + "px";
  },[editingText]);


    return(
        <div className={`p-2 rounded-lg ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
          <span className="block text-xs font-bold mb-1">{msg.userId?.name}</span>
          <textarea
            ref={editRef}
            className="p-4 w-full max-h-[160px] resize-none rounded break-words focus:outline-none focus:ring focus:ring-blue-300 bg-white text-black"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                editMessage(editingText, msg._id);
                setActiveMessageId(null);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setEditingMessageId(null);
                setActiveMessageId(null);
              }
            }}
          />
        </div>
    )
}

export default EditBubble;