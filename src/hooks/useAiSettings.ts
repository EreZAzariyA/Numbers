import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../redux/store';
import aiSettingsService from '../services/ai-settings';
import { AiProvider, AiSettingsResponse } from '../models/ai-settings';

export const AI_SETTINGS_QUERY_KEY = 'ai-settings';

const AI_RELATED_QUERY_KEYS = ['forecast', 'financialHealth', 'savings-goals'];

export const useAiSettings = () => {
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const setDataAndInvalidate = async (data: AiSettingsResponse): Promise<void> => {
    queryClient.setQueryData([AI_SETTINGS_QUERY_KEY, user?._id], data);
    await Promise.all(
      AI_RELATED_QUERY_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [key, user?._id] }))
    );
  };

  const query = useQuery({
    queryKey: [AI_SETTINGS_QUERY_KEY, user?._id],
    queryFn: () => aiSettingsService.fetchSettings(user!._id!),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 2,
  });

  const updateProviderMutation = useMutation({
    mutationFn: (provider: AiProvider) => aiSettingsService.updateProvider(user!._id!, provider),
    onSuccess: setDataAndInvalidate,
  });

  const saveKeyMutation = useMutation({
    mutationFn: ({ provider, apiKey }: { provider: Extract<AiProvider, 'gemini' | 'claude'>; apiKey: string }) =>
      aiSettingsService.saveKey(user!._id!, provider, apiKey),
    onSuccess: setDataAndInvalidate,
  });

  const clearKeyMutation = useMutation({
    mutationFn: (provider: Extract<AiProvider, 'gemini' | 'claude'>) =>
      aiSettingsService.clearKey(user!._id!, provider),
    onSuccess: setDataAndInvalidate,
  });

  const updateOllamaModelMutation = useMutation({
    mutationFn: (model: string) => aiSettingsService.updateOllamaModel(user!._id!, model),
    onSuccess: setDataAndInvalidate,
  });

  const updateOllamaThinkingMutation = useMutation({
    mutationFn: (enabled: boolean) => aiSettingsService.updateOllamaThinking(user!._id!, enabled),
    onSuccess: setDataAndInvalidate,
  });

  return {
    ...query,
    updateProvider: updateProviderMutation.mutateAsync,
    saveKey: saveKeyMutation.mutateAsync,
    clearKey: clearKeyMutation.mutateAsync,
    updateOllamaModel: updateOllamaModelMutation.mutateAsync,
    updateOllamaThinking: updateOllamaThinkingMutation.mutateAsync,
    isUpdatingProvider: updateProviderMutation.isPending,
    isSavingKey: saveKeyMutation.isPending,
    isClearingKey: clearKeyMutation.isPending,
    isUpdatingOllamaModel: updateOllamaModelMutation.isPending,
    isUpdatingOllamaThinking: updateOllamaThinkingMutation.isPending,
  };
};
