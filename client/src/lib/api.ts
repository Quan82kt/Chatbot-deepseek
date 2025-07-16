import { apiRequest } from "./queryClient";

export interface ChatResponse {
  response: string;
}

export interface ChatHistoryResponse {
  messages: {
    id: number;
    content: string;
    sender: string;
    timestamp: string;
    sessionId: string;
  }[];
}

export const chatApi = {
  sendMessage: async (message: string, sessionId: string): Promise<ChatResponse> => {
    const response = await apiRequest("POST", "/api/chat", {
      message,
      sessionId,
    });
    return response.json();
  },

  getChatHistory: async (sessionId: string): Promise<ChatHistoryResponse> => {
    const response = await apiRequest("GET", `/api/chat/${sessionId}`);
    return response.json();
  },
};
