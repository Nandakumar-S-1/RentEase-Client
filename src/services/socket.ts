import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (!socket) {
    socket = io(
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
        "http://localhost:3000",
      {
        query: { userId },
        withCredentials: true,
      },
    );
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized. Call initSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
