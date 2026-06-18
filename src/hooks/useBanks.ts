import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../redux/store';
import bankServices from '../services/banks';

export const BANKS_QUERY_KEY = 'banks';

export const useBanks = () => {
  const user = useAppSelector((state) => state.auth.user);
  return useQuery({
    queryKey: [BANKS_QUERY_KEY, user?._id],
    queryFn: () => bankServices.fetchBankAccounts(user._id),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });
};
