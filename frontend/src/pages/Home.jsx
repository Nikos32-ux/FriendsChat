import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import { useFetcher } from "react-router-dom";





const Home = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarIsTypingId, setsidebarIsTypingId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});


  useEffect(() => {
    if (!loggedInUser) return;

    socket.emit("users-online-list");

    socket.on("update-users-list", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("update-users-list");
    };
  }, [loggedInUser]);

  return (
    <div className="h-[100dvh] w-screen bg-gradient-to-b from-purple-700 via-blue-800 to-black flex ">
      <div className=" h-full backdrop-blur-2xl bg-white/10 w-full">
        <div className={`flex overflow-hidden bg-gray-900/50 h-full mx-auto w-full ${selectedUser ? "md:max-w-[1000px]" : "md:max-w-[450px]"}`}>
          <div className={`border-r border-yellow-400 ${selectedUser ? "hidden md:block md:w-[350px]" : "w-full"}`}>
            <Sidebar
              onlineUsers={onlineUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              currentUser={loggedInUser}
              lastMessages={lastMessages}
              setLastMessages={setLastMessages}
              sidebarIsTypingId={sidebarIsTypingId}
            />
          </div>
          {selectedUser &&
            <div className={`flex h-full animate-chat-entry flex-1 min-w-[320px] `}>
              <ChatContainer
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                currentUser={loggedInUser}
                socket={socket}
                lastMessages={lastMessages}
                setLastMessages={setLastMessages}
                setsidebarIsTypingId={setsidebarIsTypingId}
              />
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
