import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const { user } = useAppSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <DashboardLayout role={user.role} userName={user.fullname}>
      <div className="flex h-full bg-[color:var(--color-surface)] rounded-2xl overflow-hidden shadow-sm border border-[color:var(--color-border)]">
        <ChatSidebar selectedId={selectedChat} onSelect={setSelectedChat} />

        <ChatWindow chatId={selectedChat} />
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
