import React, { useState } from "react";
import { Search } from "lucide-react";

interface ChatSidebarProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const chats = [
  {
    id: "1",
    name: "Aswathy Sudhakaran",
    property: "2 BHK Kakkanad",
    lastMessage: "Yes, that works! Can we sc...",
    time: "2 min ago",
    unread: 2,
    avatar: null,
    online: true,
  },
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({ selectedId, onSelect }) => {
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");

  return (
    <div className="w-80 h-full flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">

      <div className="p-4 border-b border-[color:var(--color-border)]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-[color:var(--color-background)] border border-transparent rounded-xl text-sm text-[color:var(--color-foreground)] focus:outline-none focus:bg-[color:var(--color-card)] focus:border-primary/20 transition-all"
          />
        </div>
      </div>


      <div className="flex px-4 pt-4 border-b border-[color:var(--color-border)] gap-6">
        {["All", "Unread (3)"].map((tab) => {
          const isUnread = tab.includes("Unread");
          const label = isUnread ? "Unread" : "All";
          const isActive = activeTab === label;

          return (
            <button
              key={label}
              onClick={() => setActiveTab(label as "All" | "Unread")}
              className={`pb-2 text-sm font-semibold transition-all relative ${isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
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
        {chats.map((chat) => {
          const isActive = selectedId === chat.id;
          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`w-full p-4 flex items-start gap-3 transition-all text-left group ${isActive
                  ? "bg-primary/5 shadow-[inset_4px_0_0_0_#4338ca] dark:bg-primary/10"
                  : "hover:bg-[color:var(--color-background)]"
                }`}
            >

              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-[color:var(--color-surface)]">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[color:var(--color-surface)] rounded-full shadow-sm" />
                )}
              </div>


              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4
                    className={`text-sm font-bold truncate ${isActive ? "text-primary" : "text-[color:var(--color-foreground)]"}`}
                  >
                    {chat.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {chat.time}
                  </span>
                </div>
                <p className="text-[10px] text-primary font-medium mb-1 truncate">
                  {chat.property}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate group-hover:text-[color:var(--color-foreground)] transition-colors">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && !isActive && (
                    <span className="ml-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
