import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from 'antd';
import ApiKeysSection from './ApiKeysSection';

const mockSaveKey = jest.fn();
const mockClearKey = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) => {
      const translations: Record<string, string> = {
        'settings.providers.gemini': 'Gemini',
        'settings.providers.claude': 'Claude',
        'settings.providers.ollama': 'Ollama',
        'settings.apiKeys.title': 'API Keys',
        'settings.apiKeys.subtitle': 'Subtitle',
        'settings.apiKeys.securityTitle': 'Security',
        'settings.apiKeys.securityCopy': 'Encrypted on the server.',
        'settings.apiKeys.available': 'Available',
        'settings.apiKeys.notAvailable': 'Not available',
        'settings.apiKeys.savedMask': `Saved user key: ${options?.masked}`,
        'settings.apiKeys.missing': 'Missing',
        'settings.apiKeys.modelLabel': `Configured model: ${options?.model}`,
        'settings.apiKeys.inputPlaceholder': `Enter a ${options?.provider} API key`,
        'settings.apiKeys.saveAction': 'Save key',
        'settings.apiKeys.replaceAction': 'Replace key',
        'settings.apiKeys.clearAction': 'Clear key',
        'settings.apiKeys.saveSuccess': 'Saved',
        'settings.apiKeys.saveError': 'Save error',
        'settings.apiKeys.clearSuccess': 'Cleared',
        'settings.apiKeys.clearError': 'Clear error',
        'settings.apiKeys.ollamaReady': 'Ollama ready',
        'settings.apiKeys.ollamaMissing': 'Ollama missing',
        'settings.apiKeys.ollamaHint': 'Configure Ollama on the backend.',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../hooks/useAiSettings', () => ({
  useAiSettings: (): any => ({
    data: {
      providers: {
        gemini: {
          provider: 'gemini',
          available: true,
          source: 'user',
          maskedKey: '••••1234',
          model: 'gemini-2.5-flash',
        },
        claude: {
          provider: 'claude',
          available: false,
          source: 'missing',
          maskedKey: null,
          model: 'claude-3-5-sonnet-latest',
        },
        ollama: {
          provider: 'ollama',
          available: true,
          source: 'env',
          maskedKey: null,
          model: 'qwen2.5:7b',
        },
      },
    },
    saveKey: mockSaveKey,
    clearKey: mockClearKey,
    isSavingKey: false,
    isClearingKey: false,
  }),
}));

jest.mock('../../hooks/useOllamaModels', () => ({
  useOllamaModels: (): any => ({
    models: [],
    isError: false,
  }),
}));

jest.mock('../../hooks/useAiHealth', () => ({
  useAiHealth: (): any => ({
    health: {
      gemini: { status: 'ok', checkedAt: '' },
      claude: { status: 'ok', checkedAt: '' },
      ollama: { status: 'ok', checkedAt: '' },
    },
    isLoading: false,
    isError: false,
  }),
}));

describe('ApiKeysSection', () => {
  beforeEach(() => {
    mockSaveKey.mockResolvedValue(undefined);
    mockClearKey.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders masked key state and supports save/clear actions', async () => {
    render(
      <App>
        <ApiKeysSection />
      </App>
    );

    expect(screen.getByText('Saved user key: ••••1234')).toBeInTheDocument();

    const geminiInput = screen.getByPlaceholderText('Enter a Gemini API key');
    fireEvent.change(geminiInput, { target: { value: 'new-gemini-key' } });
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }));

    await waitFor(() => {
      expect(mockSaveKey).toHaveBeenCalledWith({ provider: 'gemini', apiKey: 'new-gemini-key' });
    });

    const clearButtons = screen.getAllByRole('button', { name: 'Clear key' });
    fireEvent.click(clearButtons[0]);

    await waitFor(() => {
      expect(mockClearKey).toHaveBeenCalledWith('gemini');
    });

    expect(clearButtons[1]).toBeDisabled();
  });
});
