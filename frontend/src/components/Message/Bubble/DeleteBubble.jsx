import React from "react";


const DeleteBubble = ({AiOutlineClose}) => {

    return (
        <div className="p-2 rounded-lg italic text-gray-400 bg-gray-200/50 border border-gray-300 text-center">
          <span className="flex items-center gap-2">
            <AiOutlineClose className="w-4 h-4 text-gray-400" />
            Message was deleted
          </span>
        </div>
    )
}

export default DeleteBubble;