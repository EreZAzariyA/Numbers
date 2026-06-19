import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../redux/store';
import aiSettingsService from '../services/ai-settings';

export const OLLAMA_MODELS_QUERY_KEY = 'ollama-models';

export const useOllamaModels = (enabled: boolean) => {
  const user = useAppSelector((state) => state.auth.user);

  const query = useQuery({
    queryKey: [OLLAMA_MODELS_QUERY_KEY, user?._id],
    queryFn: () => aiSettingsService.fetchOllamaModels(user!._id!),
    enabled: enabled && !!user?._id,
    staleTime: 1000 * 60 * 2,
  });

  return {
    models: query.data?.models ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
