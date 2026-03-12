import React from 'react'

const User = ({ user, isOnline, currentUser, selectedUser, lastMessages, sidebarIsTypingId, handleSelectUser }) => {
    return (
        <div key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`flex  items-center  gap-3 py-4 rounded-lg mb-2 cursor-pointer transition-all duration-300
          ${selectedUser?._id === user._id ? "bg-gradient-to-b from-gray-800 via-gray-600 to-gray-800 " : "bg-gray-700 hover:bg-gray-800"}`}
        >
            <div className="relative shrink-0 ">
                <img src={user.profile} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover transition-all duration-300" />
                <span className={`absolute -bottom-1 -right-0 w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <span className="font-medium text-white text-base sm:text-lg  ">
                    {user.name}
                </span>
                {sidebarIsTypingId === user._id ? (
                    <span className="text-sm text-red-300">
                        {`${user.name.split(" ")[0]} is typing...`}
                    </span>
                ) : (
                    <div className="font-normal flex items-center text-sm gap-2 w-full ">
                        <p className=" truncate min-w-0 text-gray-200 ">
                            {
                                lastMessages?.message
                                    ? currentUser._id === lastMessages?.userId
                                        ? <>
                                            <span className='flex items-center '>
                                                <span className='mr-1'>You : </span>
                                                <span className='truncate ml-2 text-sm md:text-xl max-w-[330px]'>
                                                    {lastMessages?.message}
                                                </span>
                                            </span>
                                        </>
                                        : <span className='flex'>
                                            <span className={`${lastMessages.bold ? "font-bold" : "text-white"} truncate max-w-[300px] sm:max-w[350px]`}>{lastMessages?.message}</span>
                                        </span>
                                    : "No message yet"
                            }
                        </p>
                        {currentUser._id === lastMessages?.userId ? (
                            <span className={` shrink-0 ${lastMessages?.sidebarRead ? "text-[rgba(158,10,42,0.82)]" : "text-[rgba(110,111,121,0.82)]"}`}>
                                ✓✓
                            </span>
                        ) : ""}
                    </div>
                )}
            </div>

            {(lastMessages?.filteredCount > 0) && (
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    {lastMessages?.filteredCount}
                </span>
            )}
        </div>

    )
}

export default User
