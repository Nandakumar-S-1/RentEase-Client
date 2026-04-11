import React from "react";
import { Phone, Video, MoreVertical, Paperclip, Image as ImageIcon, Smile, Send } from "lucide-react";

interface ChatWindowProps {
  chatId: string | null;
}

const mockMessages = [
  {
    id: "1",
    sender: "Aswathy Sudhakaran",
    text: "Hi, I'm interested in the 2 BHK flat in Kakkanad. When can I visit?",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "Me",
    text: "Hello Aswathy! You can visit tomorrow at 10 AM.",
    time: "10:32 AM",
    isMe: true,
    status: "read",
  },
];

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[color:var(--color-background)] text-gray-400 p-8">
        <div className="p-4 bg-[color:var(--color-surface)] rounded-full mb-4">
          <Send size={32} className="opacity-20" />
        </div>
        <p className="text-sm font-medium">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[color:var(--color-surface)] relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="relative border-r border-[color:var(--color-border)] pr-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm ring-2 ring-[color:var(--color-surface)]">
               AS
            </div>
            <div className="absolute bottom-0 right-3 w-2.5 h-2.5 bg-green-500 border-2 border-[color:var(--color-surface)] rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[color:var(--color-foreground)] leading-none mb-1">Aswathy Sudhakaran</h3>
            <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
              <span className="text-green-500 font-bold">Online</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>2 BHK Kakkanad</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 border border-transparent hover:bg-[color:var(--color-background)] hover:border-[color:var(--color-border)] rounded-lg text-gray-400 hover:text-[color:var(--color-foreground)] transition-all">
            <Phone size={18} />
          </button>
          <button className="p-2 border border-transparent hover:bg-[color:var(--color-background)] hover:border-[color:var(--color-border)] rounded-lg text-gray-400 hover:text-[color:var(--color-foreground)] transition-all">
            <Video size={18} />
          </button>
          <button className="p-2 border border-transparent hover:bg-[color:var(--color-background)] hover:border-[color:var(--color-border)] rounded-lg text-gray-400 hover:text-[color:var(--color-foreground)] transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[color:var(--color-background)]/20">
        <div className="flex justify-center my-4">
           <span className="text-[10px] font-bold text-gray-400 bg-[color:var(--color-surface)] px-3 py-1 rounded-full border border-[color:var(--color-border)] uppercase tracking-widest">Today</span>
        </div>

        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
          >
            <div className="flex items-end gap-2 max-w-[80%]">
              {!msg.isMe && (
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[8px] font-black text-indigo-600 dark:text-indigo-300 mb-1 shrink-0">
                  AS
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-300 ${
                  msg.isMe
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] border border-[color:var(--color-border)] rounded-tl-none"
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1.5 flex items-center gap-1.5 ${msg.isMe ? "text-indigo-100 justify-end" : "text-gray-400 justify-start"}`}>
                  {msg.time}
                  {msg.isMe && (
                    <span className="flex">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-3 bg-[color:var(--color-background)] border border-transparent focus-within:border-primary/20 focus-within:bg-[color:var(--color-card)] p-2 rounded-2xl transition-all group">
          <div className="flex items-center gap-1.5 px-1 border-r border-[color:var(--color-border)]">
             <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Paperclip size={18} />
             </button>
             <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <ImageIcon size={18} />
             </button>
          </div>
          
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 bg-transparent text-sm py-2 focus:outline-none placeholder:text-gray-400 text-[color:var(--color-foreground)] font-medium"
          />

          <div className="flex items-center gap-2 pr-1">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Smile size={18} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
