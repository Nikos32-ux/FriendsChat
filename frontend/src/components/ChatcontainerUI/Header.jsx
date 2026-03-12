import React from "react";

export const Header = ({closeTab, setCloseTab, selectedUser, setSelectedUser}) => {
    return (
        <div className=" border-b flex items-center gap-3 bg-gray-900 text-white px-4 py-3 shadow-md border-gray-700 transition-colors duration-200">
            <div
                className={`bg-gray-800 p-2 flex items-center justify-center gap-2 rounded-md hover: bg-gray-700 cursor-pointer shadow-lg `}
                onMouseEnter={() => setCloseTab(true)}
                onMouseLeave={() => setCloseTab(null)}
            >
                <div className="relative flex gap-2">
                    <img src={selectedUser?.profile} alt={selectedUser?.name} className="w-6 h-7 rounded-full object-cover" />
                    <span className="font-semibold">{selectedUser?.name}</span>
                    <span
                        className={` ${closeTab ? "absolute -top-4 -right-1 text-md font-semibold" : "hidden"}`}
                        onClick={() => setSelectedUser(null)}
                    >x</span>
                </div>
            </div>
        </div>
    )
}