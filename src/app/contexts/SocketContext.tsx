// eslint-disable-next-line react-refresh/only-export-components -- Context provider and hook are intentionally co-located
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { addNotification } from "../../features/notifications/slices/notificationSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

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
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
