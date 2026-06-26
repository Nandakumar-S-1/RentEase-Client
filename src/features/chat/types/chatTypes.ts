export interface ChatParticipant {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  lastActive: string | null;
}

export interface ChatProperty {
  id: string;
  title: string;
  photos: string[];
}

export interface ChatMessageSender {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string | null;
  attachmentUrl: string | null;
  attachmentType: string | null;
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
  sender: ChatMessageSender;
}

export interface ChatSummary {
  id: string;
  participant1Id: string;
  participant2Id: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  participant1: ChatParticipant;
  participant2: ChatParticipant;
  property: ChatProperty;
  messages: ChatMessage[];
}

export interface GetMyChatsResponse {
  success: boolean;
  chats: ChatSummary[];
}

export interface GetChatMessagesResponse {
  success: boolean;
  messages: ChatMessage[];
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
}

export interface InitiateChatResponse {
  success: boolean;
  chat: ChatSummary;
}

export interface SendMessagePayload {
  chatId: string;
  content?: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface InitiateChatPayload {
  ownerId: string;
  propertyId: string;
}
