import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
} from "lucide-react";
import { useChatMessages } from "../hooks/useChatMessages";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import VideoCallModal from "./VideoCallModal";
import type { ChatSummary } from "../types/chatTypes";

interface ChatWindowProps {
  chatId: string | null;
  chatDetails?: ChatSummary | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, chatDetails }) => {
  const [inputText, setInputText] = useState("");
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { messages, isLoading, send, isTyping, isOnline, emitTyping } =
    useChatMessages(chatId);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const otherParticipant =
    chatDetails?.participant1Id === user?.id
      ? chatDetails?.participant2
      : chatDetails?.participant1;

  const otherName = otherParticipant?.fullName || "Unknown";
  const otherAvatar = otherParticipant?.avatarUrl;
  const otherInitial = otherName.substring(0, 2).toUpperCase();
  const propertyTitle = chatDetails?.property?.title || "Property";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    void send({ content: inputText.trim() });
    setInputText("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    try {
      setIsUploading(true);
      // Get presigned URL
      const response = await fetch("/api/chat/upload-photo-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // or get from auth state if possible, though cookies might be used
        },
        body: JSON.stringify({
          files: [{ fileName: file.name, contentType: file.type }],
        }),
      });

      const data = await response.json();
      if (data.success && data.uploads.length > 0) {
        const { uploadUrl, publicUrl } = data.uploads[0];

        // Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Send chat message
        await send({
          content: "",
          attachmentUrl: publicUrl,
          attachmentType: file.type,
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm ring-2 ring-[color:var(--color-surface)] overflow-hidden text-primary">
              {otherAvatar ? (
                <img
                  src={otherAvatar}
                  alt={otherName}
                  className="w-full h-full object-cover"
                />
              ) : (
                otherInitial
              )}
            </div>
            <div className="absolute bottom-0 right-3 w-2.5 h-2.5 bg-green-500 border-2 border-[color:var(--color-surface)] rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[color:var(--color-foreground)] leading-none mb-1">
              {otherName}
            </h3>
            <p className="text-[10px] text-gray-500 flex items-center gap-1.5 h-4">
              {isTyping ? (
                <span className="text-primary font-bold italic animate-pulse">
                  Typing...
                </span>
              ) : isOnline ? (
                <span className="text-green-500 font-bold">Online</span>
              ) : (
                <span className="text-gray-400 font-medium">Offline</span>
              )}
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="truncate max-w-[150px]">{propertyTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 border border-transparent hover:bg-[color:var(--color-background)] hover:border-[color:var(--color-border)] rounded-lg text-gray-400 hover:text-[color:var(--color-foreground)] transition-all">
            <Phone size={18} />
          </button>
          <button
            onClick={() => setIsVideoCallOpen(true)}
            className="p-2 border border-transparent hover:bg-[color:var(--color-background)] hover:border-[color:var(--color-border)] rounded-lg text-gray-400 hover:text-[color:var(--color-foreground)] transition-all"
          >
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
          <span className="text-[10px] font-bold text-gray-400 bg-[color:var(--color-surface)] px-3 py-1 rounded-full border border-[color:var(--color-border)] uppercase tracking-widest">
            Today
          </span>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-gray-400">
            Loading messages...
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const senderInitial =
              msg.sender?.fullName?.substring(0, 2).toUpperCase() || "U";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!isMe && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[8px] font-black text-indigo-600 dark:text-indigo-300 mb-1 shrink-0 overflow-hidden">
                      {msg.sender?.avatarUrl ? (
                        <img
                          src={msg.sender.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        senderInitial
                      )}
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-lg text-xs leading-relaxed shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-300 ${
                      isMe
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] border border-[color:var(--color-border)] rounded-tl-none"
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <div className="mb-2">
                        {msg.attachmentType?.startsWith("image/") ? (
                          <img
                            src={msg.attachmentUrl}
                            alt="attachment"
                            className="max-w-[200px] max-h-[200px] rounded object-cover cursor-pointer"
                            onClick={() =>
                              window.open(msg.attachmentUrl!, "_blank")
                            }
                          />
                        ) : (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline font-bold"
                          >
                            View Attachment
                          </a>
                        )}
                      </div>
                    )}
                    {msg.content}
                    <div
                      className={`text-[9px] mt-1.5 flex items-center gap-1.5 ${isMe ? "text-indigo-100 justify-end" : "text-gray-400 justify-start"}`}
                    >
                      {time}
                      {isMe && (
                        <span className="flex">
                          {msg.status === "READ" ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3 h-3 fill-current text-blue-300"
                            >
                              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3 h-3 fill-current"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-3 bg-[color:var(--color-background)] border border-transparent focus-within:border-primary/20 focus-within:bg-[color:var(--color-card)] p-2 rounded-lg transition-all group">
          <div className="flex items-center gap-1.5 px-1 border-r border-[color:var(--color-border)]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            >
              <Paperclip size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <ImageIcon size={18} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Write a message..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              emitTyping(e.target.value.length > 0);
            }}
            onBlur={() => emitTyping(false)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent text-sm py-2 focus:outline-none placeholder:text-gray-400 text-[color:var(--color-foreground)] font-medium"
          />

          <div className="flex items-center gap-2 pr-1">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Smile size={18} />
            </button>
            <button
              onClick={handleSend}
              className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        roomName={`RentEaseTour-${chatId}`}
        userName={user?.fullname || "User"}
      />
    </div>
  );
};

export default ChatWindow;
