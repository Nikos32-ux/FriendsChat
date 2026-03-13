import React, { useState } from 'react'

const User = ({ user, isOnline, currentUser, selectedUser, lastMessages, sidebarIsTypingId, handleSelectUser }) => {
    const [fullMesage, setFullMessage] = useState(false);
    return (
        <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            onMouseEnter={() => { setFullMessage(true) }}
            onMouseLeave={() => { setFullMessage(false) }}
            className={`relative flex items-start gap-3 py-4 rounded-lg mb-2 cursor-pointer transition-all duration-300
          ${selectedUser?._id === user._id ? "bg-gradient-to-b from-gray-800 via-gray-600 to-gray-800 " : "bg-gray-700 hover:bg-gray-800"}`}

        >
            <div className="img-container relative shrink-0 ml-2 self-start mt-2">
                <img src={user.profile} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover transition-all duration-300" />
                <span className={`absolute -bottom-1 -right-0 w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div className="name-message-container flex flex-1 flex-col justify-center min-w-0 ">
                <span className="font-medium text-white ">
                    {user.name}
                </span>
                {sidebarIsTypingId === user._id
                    ? (
                        <span className="text-sm text-red-300">
                            {`${user.name.split(" ")[0]} is typing...`}
                        </span>
                    )
                    : (
                        <div className="font-normal flex gap-2 min-w-0 ">
                            <div className='flex items-center gap-1.5  min-w-0'>
                                <div className=" text-gray-200 text-sm min-w-0 ">
                                    {
                                        lastMessages?.message
                                            ? currentUser._id === lastMessages?.userId
                                                ? <>
                                                    <div className='flex'>
                                                        <span className='shrink-0'>You : </span>
                                                        <span
                                                            className={`text-sm min-w-0 w-full ${fullMesage
                                                                ? "whitespace-normal break-words"
                                                                : "truncate"
                                                                }`}>
                                                            {lastMessages?.message}
                                                        </span>
                                                    </div>
                                                </>
                                                : <div className='flex'>
                                                    <span
                                                        className={`min-w-0 text-sm pr-5 w-full ${lastMessages.bold ? "font-bold" : "text-white"} ${fullMesage ? "whitespace-normal break-words" : "truncate"}`}>
                                                        {lastMessages?.message}
                                                    </span>
                                                    
                                                </div>
                                            : "No message yet"
                                    }
                                </div>
                                {currentUser._id === lastMessages?.userId ? (
                                    <span className={`text-[15px] self-end shrink-0 ${lastMessages?.sidebarRead ? "text-[rgba(158,10,42,0.82)]" : "text-[rgba(110,111,121,0.82)]"}`}>
                                        ✓✓
                                    </span>
                                ) : ""}
                            </div>

                        </div>
                    )}
            </div>

            {(lastMessages?.filteredCount > 0) && (
                <span className="unread-messages ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    {lastMessages?.filteredCount}
                </span>
            )}
        </div>

    )
}

export default User
