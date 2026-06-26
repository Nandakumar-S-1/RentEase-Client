import React, { useState } from "react";
import { Search } from "lucide-react";
import type { ChatSummary } from "../types/chatTypes";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import { useSocket } from "../../../app/contexts/SocketContext";

interface ChatSidebarProps {
  chats: ChatSummary[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  isLoading,
  selectedId,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { onlineUsers, typingChats } = useSocket();

  const filteredChats = chats.filter((chat) => {
    const otherParticipant =
      chat.participant1Id === user?.id ? chat.participant2 : chat.participant1;
      
    const matchesSearch =
      otherParticipant?.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chat.property?.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "Unread") {
      const lastMessage = chat.messages?.[0];
      const isUnread =
        lastMessage &&
        lastMessage.status !== "READ" &&
        lastMessage.senderId !== user?.id;
      return matchesSearch && isUnread;
    }

    return matchesSearch;
  });

  return (
    <div className="w-80 h-full flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="p-4 border-b border-[color:var(--color-border)]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[color:var(--color-background)] border border-transparent rounded-xl text-sm text-[color:var(--color-foreground)] focus:outline-none focus:bg-[color:var(--color-card)] focus:border-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex px-4 pt-4 border-b border-[color:var(--color-border)] gap-6">
        {["All", "Unread"].map((tab) => {
          const label = tab;
          const isActive = activeTab === label;

          return (
            <button
              key={label}
              onClick={() => setActiveTab(label as "All" | "Unread")}
              className={`pb-2 text-sm font-semibold transition-all relative ${
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-300" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Loading chats...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = selectedId === chat.id;
            const otherParticipant =
              chat.participant1Id === user?.id
                ? chat.participant2
                : chat.participant1;
            const lastMessage = chat.messages?.[0];
            const name = otherParticipant?.fullName || "Unknown";
            const avatar = otherParticipant?.avatarUrl;
            const propertyTitle = chat.property?.title || "Property";

            // Format time if last message exists
            let timeStr = "";
            if (lastMessage) {
              const date = new Date(lastMessage.createdAt);
              timeStr = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            }

            return (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`w-full p-4 flex items-start gap-3 transition-all text-left group ${
                  isActive
                    ? "bg-primary/5 shadow-[inset_4px_0_0_0_#4338ca] dark:bg-primary/10"
                    : "hover:bg-[color:var(--color-background)]"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-[color:var(--color-surface)] overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                    )}
                  </div>
                  {otherParticipant?.id && onlineUsers.includes(otherParticipant.id) && (
                    <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[color:var(--color-surface)] rounded-full shadow-sm" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4
                      className={`text-sm font-bold truncate ${isActive ? "text-primary" : "text-[color:var(--color-foreground)]"}`}
                    >
                      {name}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {timeStr}
                    </span>
                  </div>
                  <p className="text-[10px] text-primary font-medium mb-1 truncate">
                    {propertyTitle}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-xs truncate transition-colors ${
                      lastMessage && lastMessage.status !== "READ" && lastMessage.senderId !== user?.id 
                        ? "text-[color:var(--color-foreground)] font-semibold" 
                        : "text-gray-500 group-hover:text-[color:var(--color-foreground)]"
                    }`}>
                      {typingChats.includes(chat.id) ? (
                        <span className="text-primary italic animate-pulse">Typing...</span>
                      ) : (
                        lastMessage?.content || "No messages yet"
                      )}
                    </p>
                    {lastMessage && lastMessage.status !== "READ" && lastMessage.senderId !== user?.id && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
