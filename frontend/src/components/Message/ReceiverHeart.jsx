import React from "react";

const ReceiverHeart = ({msg,handleHeart,AiFillHeart,AiOutlineHeart}) =>{
    return (
        <span 
          onClick={handleHeart} 
          className={`cursor-pointer ${msg.deleted ? "hidden" : ""} 
                    transition-transform active:scale-125 duration-300 ease-in-out
                    ml-2 flex-shrink-0 bg-gray-100/40 rounded-[100%] shadow-[0_4px_30px_rgba(0,0,0,0.5)] border p-1 border-gray-100/40`
                    }>
          {msg.icon ? (
            <span className="text-sm">{msg.icon}</span>
          ) : msg.hearted ? (
            <AiFillHeart className="!text-red-600 w-5 h-5" />
          ) : (
            <AiOutlineHeart className="text-gray-500 w-5 h-5" />
          )}
        </span>
    )
}

export default ReceiverHeart;