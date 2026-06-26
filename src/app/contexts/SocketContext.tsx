/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import {
  addNotification,
  incrementSidebarBadge,
} from "../../features/notifications/slices/notificationSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  typingChats: string[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, onlineUsers: [], typingChats: [] });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingChats, setTypingChats] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const socketInstance = io(
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
          "http://localhost:3000",
        {
          query: {
            userId: user.id,
          },
        },
      );

      socketInstance.on("connect", () => {
        console.log("Connected to socket server with id:", socketInstance.id);
      });

      socketInstance.on("notification:new", (notification) => {
        dispatch(addNotification(notification));
        toast.success(notification.title || "New Notification", {
          icon: "🔔",
          duration: 5000,
        });

        // Add specific sidebar badge increments based on notification types
        if (
          notification.notificationType === "OWNER_VERIFICATION_SUBMITTED" &&
          user?.role === "ADMIN"
        ) {
          dispatch(incrementSidebarBadge("admin_owner_verification"));
        }
      });

      socketInstance.on("user_status_change", ({ userId, isOnline }) => {
        setOnlineUsers((prev) => {
          if (isOnline) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter((id) => id !== userId);
          }
        });
      });

      socketInstance.on("user_typing_start", (data: { chatId: string }) => {
        setTypingChats((prev) => prev.includes(data.chatId) ? prev : [...prev, data.chatId]);
      });

      socketInstance.on("user_typing_end", (data: { chatId: string }) => {
        setTypingChats((prev) => prev.filter((id) => id !== data.chatId));
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 'socket' is intentionally omitted; including it would cause an infinite loop since this effect manages the socket instance
  }, [isAuthenticated, user?.id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingChats }}>
      {children}
    </SocketContext.Provider>
  );
};
