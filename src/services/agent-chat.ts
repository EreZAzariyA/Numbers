import axios from "axios";
import config from "../utils/config";

// Normalized shape of an agent action failure. The backend returns a localized
// plain-text message as the response body for ClientErrors, so we surface both
// the HTTP status and that message to the UI.
export type AgentActionError = {
  status?: number;
  serverMessage?: string;
};

// A staged action that no longer exists (404) or is no longer pending — expired,
// cancelled, or already confirmed (409) — cannot be acted on again.
export const isDeadActionStatus = (status?: number): boolean => status === 404 || status === 409;

export const parseAgentActionError = (error: unknown): AgentActionError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return {
      status: error.response?.status,
      serverMessage: typeof data === "string" && data.trim() ? data : undefined,
    };
  }
  return {};
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  sentAt?: string;
  responseTime?: number;
};
export type PendingAgentAction = {
  id: string;
  tool: string;
  summary: string;
  argsPreview: Record<string, unknown>;
  expiresAt: string;
};
export type AgentProgressEvent = {
  requestId: string;
  step: string;
  label: string;
  status: 'active' | 'complete' | 'error';
  at: string;
  tool?: string;
};

type ChatResponse = { reply: string; pendingAction?: PendingAgentAction | null };
type HistoryResponse = { messages: ChatMessage[]; pendingAction?: PendingAgentAction | null };
type AgentActionResponse = { reply: string };

class AgentChatService {
  // Send a single new message — the server manages the full history
  sendMessage = async (message: string, language: string, requestId?: string, signal?: AbortSignal): Promise<ChatResponse> => {
    const response = await axios.post<ChatResponse>(config.urls.agentChat, { message, language, requestId }, { signal });
    return response.data;
  };

  // Load persisted history on chat open
  getHistory = async (): Promise<HistoryResponse> => {
    const response = await axios.get<HistoryResponse>(config.urls.agentHistory);
    return response.data;
  };

  // Clear all history for the current user
  clearHistory = async (): Promise<void> => {
    await axios.delete(config.urls.agentHistory);
  };

  confirmAction = async (actionId: string, language: string, signal?: AbortSignal): Promise<AgentActionResponse> => {
    const response = await axios.post<AgentActionResponse>(
      `${config.urls.agentActions}/${actionId}/confirm`,
      { language },
      { signal }
    );
    return response.data;
  };

  cancelAction = async (actionId: string, language: string, signal?: AbortSignal): Promise<AgentActionResponse> => {
    const response = await axios.post<AgentActionResponse>(
      `${config.urls.agentActions}/${actionId}/cancel`,
      { language },
      { signal }
    );
    return response.data;
  };
}

const agentChatService = new AgentChatService();
export default agentChatService;
