export type AiProvider = 'ollama' | 'gemini' | 'claude';
export type AiProviderSource = 'user' | 'env' | 'missing';

export interface AiProviderStatus {
  provider: AiProvider;
  available: boolean;
  source: AiProviderSource;
  maskedKey: string | null;
  model: string | null;
}

export interface AiSettingsResponse {
  provider: AiProvider;
  providers: Record<AiProvider, AiProviderStatus>;
  ollamaThinking: boolean;
}

export interface OllamaModelsResponse {
  models: string[];
}

export type AiHealthStatus = 'ok' | 'error' | 'unknown';

export interface AiProviderHealth {
  status: AiHealthStatus;
  checkedAt: string;
  error?: string;
}

export type AiHealthResponse = Record<AiProvider, AiProviderHealth>;
