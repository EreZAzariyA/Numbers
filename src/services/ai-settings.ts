import axios from "axios";
import config from "../utils/config";
import { AiHealthResponse, AiProvider, AiSettingsResponse, OllamaModelsResponse } from "../models/ai-settings";

class AiSettingsService {
  fetchSettings = async (userId: string): Promise<AiSettingsResponse> => {
    const response = await axios.get<AiSettingsResponse>(`${config.urls.users.aiSettings}/${userId}`);
    return response.data;
  };

  updateProvider = async (userId: string, provider: AiProvider): Promise<AiSettingsResponse> => {
    const response = await axios.put<AiSettingsResponse>(
      `${config.urls.users.aiSettings}/${userId}/provider`,
      { provider },
    );
    return response.data;
  };

  saveKey = async (
    userId: string,
    provider: Extract<AiProvider, 'gemini' | 'claude'>,
    apiKey: string,
  ): Promise<AiSettingsResponse> => {
    const response = await axios.put<AiSettingsResponse>(
      `${config.urls.users.aiSettings}/${userId}/keys`,
      { provider, apiKey },
    );
    return response.data;
  };

  clearKey = async (
    userId: string,
    provider: Extract<AiProvider, 'gemini' | 'claude'>,
  ): Promise<AiSettingsResponse> => {
    const response = await axios.delete<AiSettingsResponse>(
      `${config.urls.users.aiSettings}/${userId}/keys/${provider}`,
    );
    return response.data;
  };

  fetchHealth = async (userId: string): Promise<AiHealthResponse> => {
    const response = await axios.get<AiHealthResponse>(
      `${config.urls.users.aiSettings}/${userId}/health`,
    );
    return response.data;
  };

  fetchOllamaModels = async (userId: string): Promise<OllamaModelsResponse> => {
    const response = await axios.get<OllamaModelsResponse>(
      `${config.urls.users.aiSettings}/${userId}/ollama-models`,
    );
    return response.data;
  };

  updateOllamaModel = async (userId: string, model: string): Promise<AiSettingsResponse> => {
    const response = await axios.put<AiSettingsResponse>(
      `${config.urls.users.aiSettings}/${userId}/ollama-model`,
      { model },
    );
    return response.data;
  };

  updateOllamaThinking = async (userId: string, enabled: boolean): Promise<AiSettingsResponse> => {
    const response = await axios.put<AiSettingsResponse>(
      `${config.urls.users.aiSettings}/${userId}/ollama-thinking`,
      { enabled },
    );
    return response.data;
  };
}

const aiSettingsService = new AiSettingsService();
export default aiSettingsService;
