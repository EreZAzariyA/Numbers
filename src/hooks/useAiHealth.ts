import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../redux/store';
import aiSettingsService from '../services/ai-settings';

export const AI_HEALTH_QUERY_KEY = 'ai-health';

const HEALTH_STALE_TIME_MS = 1000 * 60;

export const useAiHealth = (enabled: boolean = true) => {
  const user = useAppSelector((state) => state.auth.user);

  const query = useQuery({
    queryKey: [AI_HEALTH_QUERY_KEY, user?._id],
    queryFn: () => aiSettingsService.fetchHealth(user!._id!),
    enabled: enabled && !!user?._id,
    staleTime: HEALTH_STALE_TIME_MS,
  });

  return {
    health: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
