import { useState, useEffect, useCallback } from "react";
import { getChatMessages, sendMessage } from "../services/chatService";
import type { ChatMessage, SendMessagePayload } from "../types/chatTypes";
import { getSocket } from "../../../services/socket";

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  send: (payload: Omit<SendMessagePayload, "chatId">) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  refetch: () => Promise<void>;
  isTyping: boolean;
  isOnline: boolean;
  emitTyping: (isTyping: boolean) => void;
}

export const useChatMessages = (
  chatId: string | null,
): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to true or pull from presence

  const emitTyping = useCallback(
    (typing: boolean) => {
      const socket = getSocket();
      if (socket && chatId) {
        socket.emit(typing ? "typing_start" : "typing_end", { chatId });
      }
    },
    [chatId],
  );

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await getChatMessages(chatId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    setMessages([]);
    void fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("join_chat", chatId);

    socket.on("receive_message", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socket.on("user_typing_start", (data: { chatId: string }) => {
      if (data.chatId === chatId) setIsTyping(true);
    });

    socket.on("user_typing_end", (data: { chatId: string }) => {
      if (data.chatId === chatId) setIsTyping(false);
    });

    socket.on(
      "user_status_change",
      (data: { userId: string; isOnline: boolean }) => {
        // If we had the other user's ID here, we could filter. For now, assume it's for this chat.
        setIsOnline(data.isOnline);
      },
    );

    return () => {
      socket.emit("leave_chat", chatId);
      socket.off("receive_message");
      socket.off("user_typing_start");
      socket.off("user_typing_end");
      socket.off("user_status_change");
    };
  }, [chatId]);

  const send = useCallback(
    async (payload: Omit<SendMessagePayload, "chatId">) => {
      if (!chatId) return;
      try {
        const response = await sendMessage({ chatId, ...payload });
        if (response.success) {
          setMessages((prev) => [...prev, response.message]);
        }
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMsg);
      }
    },
    [chatId],
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
  }, []);

  return {
    messages,
    isLoading,
    error,
    send,
    addMessage,
    refetch: fetchMessages,
    isTyping,
    isOnline,
    emitTyping,
  };
};
