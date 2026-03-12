import React from "react";

const SenderHeart = ({msg,handleHeart,AiFillHeart,AiOutlineHeart}) =>{
    return (
        <div 
          onClick={handleHeart} 
          className={`cursor-pointer ${msg.deleted ? "hidden" : ""}  transition-transform active:scale-125 duration-300 p-1 ease-in-out ml-1 flex-shrink-0 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]`}>
          {msg.icon ? (
            <span className=" text-lg">{msg.icon}</span>
          ) : msg.hearted ? (
            <AiFillHeart className="!text-red-600 w-5 h-5" />
          ) : (
            <AiOutlineHeart className="text-gray-500 w-5 h-5" />
          )}
        </div>
    )
}

export default SenderHeart;