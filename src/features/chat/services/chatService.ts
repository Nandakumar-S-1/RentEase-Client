import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  GetMyChatsResponse,
  GetChatMessagesResponse,
  SendMessageResponse,
  InitiateChatResponse,
  SendMessagePayload,
  InitiateChatPayload,
} from "../types/chatTypes";

export const getMyChats = async (): Promise<GetMyChatsResponse> => {
  const response = await axiosApi.get<GetMyChatsResponse>(
    API_ROUTES.GET_MY_CHATS,
  );
  return response.data;
};

export const getChatMessages = async (
  chatId: string,
): Promise<GetChatMessagesResponse> => {
  const response = await axiosApi.get<GetChatMessagesResponse>(
    API_ROUTES.GET_CHAT_MESSAGES(chatId),
  );
  return response.data;
};

export const sendMessage = async (
  data: SendMessagePayload,
): Promise<SendMessageResponse> => {
  const response = await axiosApi.post<SendMessageResponse>(
    API_ROUTES.SEND_MESSAGE,
    data,
  );
  return response.data;
};

export const initiateChat = async (
  data: InitiateChatPayload,
): Promise<InitiateChatResponse> => {
  const response = await axiosApi.post<InitiateChatResponse>(
    API_ROUTES.INITIATE_CHAT,
    data,
  );
  return response.data;
};
