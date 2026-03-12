import React, { useEffect, useState, useContext, useMemo, useReducer } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import User from "./User.jsx";
import api from '../../axiosConfig.js'



const Sidebar = ({ onlineUsers, selectedUser, setSelectedUser, currentUser,lastMessages, setLastMessages, sidebarIsTypingId }) => {

  const { logout } = useContext(AuthContext);
  const initialState = {
    users : [],
    search : ""
  };


  const sidebarReducer = (state, action) => {
    switch (action.type) {
      case "SET_USERS":
        return { ...state, users: action.payload };
      case "SET_SEARCH":
        return { ...state, search: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(sidebarReducer, initialState);


   const getLastMessages = async () => {
      try {
        const res = await api.post(
          "/api/messages/get-last-messages",
          { withCredentials: true }
        );
        if (res.data.success) {
          const conversationContainer = {};
          const conversations = res.data.conversations;
          console.log("conversations", conversations);
        
          for (let con of conversations){
            const conversation_messages = con.messages;
            const conversation_members = con.members;

            
            const otherPerson = conversation_members.find(id => id !== currentUser._id);
            const userId = conversation_messages?.length > 0 ? conversation_messages.at(-1).userId.toString() : "" ;
            const receiverId = conversation_messages?.length > 0 ? conversation_messages.at(-1).receiverId.toString() : "";
            const lastMessage = conversation_messages?.length > 0 ? conversation_messages.at(-1).message : "";
            
            let isBold = null;
            
            if(conversation_messages.at(-1).userId === otherPerson && conversation_messages.at(-1).read === false){ 
              isBold = true;
            } else{
              isBold = false;
            }

            const filteredCount = conversation_messages.filter(msg => msg.userId === otherPerson && msg.read === false).length;
            
            conversationContainer[otherPerson] = {
              userId: userId,
              receiverId:receiverId,
              message: lastMessage,
              bold: isBold,
              filteredCount: filteredCount
            };
          }
          setLastMessages(conversationContainer);
        }
      } catch (err) {
        console.error(err.response?.data.message);
      }
    };


  // Fetch last messages for every sidebar user
  useEffect(() => {
    getLastMessages();
  }, [currentUser]);

  const fetchUsers = async () => {
      try {
        const res = await api.get("/api/auth/all_users", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch({
            type: "SET_USERS",
            payload: res.data.users.filter((u) => u._id !== currentUser._id),
          });
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

  //fetch Users
  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const filteredUsers = state.users.filter((u) =>
      u.name.toLowerCase().includes(state.search.toLowerCase())
    );

  
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setLastMessages(prev => ({...prev, [u._id]: {... prev[u._id], bold: false, filteredCount: 0}}));
  };

  return (
    <div className="h-full w-full bg-gray-800 backdrop-blur-sm shadow-[4px_0_10px_0_rgba(255,215,0,0.3)] flex flex-col ">
      <div className="break-words p-4 text-2xl text-white mt-2">
        <h1>
          Welcome{" "}
          <span className="cursor-pointer text-red-400 ml-2 font-semibold italic">{currentUser.name}</span>
        </h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search users..."
          value={state.search}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          className="w-[100%] py-3 px-2 rounded-lg border border-gray-500 bg-gray-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-red-400  hover:border-gray-400 transition-colors duration-200"
        />
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto mt-3 bg-gray-600 py-2 gap-2 px-1 rounded-sm">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);

          return (
            <User
              key = {user._id}
              user = {user}
              isOnline={isOnline}
              selectedUser = {selectedUser}
              currentUser = {currentUser}
              handleSelectUser = {handleSelectUser}
              lastMessages = {lastMessages[user._id]}
              sidebarIsTypingId = {sidebarIsTypingId}
            />
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 mb-5">
        <button
          onClick={logout}
          className="w-full py-2 bg-red-600 hover:bg-red-800 hover:cursor-pointer text-white font-bold rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>
    </div>

  );
};

export default Sidebar;
