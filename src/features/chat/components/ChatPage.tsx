import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import { useChats } from "../hooks/useChats";
import { initSocket, disconnectSocket } from "../../../services/socket";

const ChatPage: React.FC = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<string | null>(
    location.state?.selectedChat || null,
  );
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { chats, isLoading } = useChats();

  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedChat(chats[0].id);
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    if (user) {
      initSocket(user.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  if (!user) return null;

  const selectedChatData = chats.find((c) => c.id === selectedChat) || null;

  return (
    <DashboardLayout role={user.role} userName={user.fullname}>
      <div className="flex h-full bg-[color:var(--color-surface)] rounded-lg overflow-hidden shadow-sm border border-[color:var(--color-border)]">
        <ChatSidebar
          chats={chats}
          isLoading={isLoading}
          selectedId={selectedChat}
          onSelect={setSelectedChat}
        />

        <ChatWindow chatId={selectedChat} chatDetails={selectedChatData} />
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
