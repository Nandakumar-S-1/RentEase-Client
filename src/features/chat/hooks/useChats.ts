import { useState, useEffect, useCallback } from "react";
import { getMyChats } from "../services/chatService";
import type { ChatSummary } from "../types/chatTypes";

interface UseChatsReturn {
  chats: ChatSummary[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useChats = (): UseChatsReturn => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyChats();
      if (response.success) {
        setChats(response.chats);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load chats";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchChats();
  }, [fetchChats]);

  return { chats, isLoading, error, refetch: fetchChats };
};
