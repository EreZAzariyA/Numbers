import type { QueryClient } from "@tanstack/react-query";
import { BANKS_QUERY_KEY } from "../hooks/useBanks";

export const invalidateFinancialQueries = async (
  queryClient: QueryClient,
  userId: string | null | undefined
) => {
  if (!userId) {
    return;
  }

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY, userId] }),
    queryClient.invalidateQueries({ queryKey: ["transactions", userId] }),
    queryClient.invalidateQueries({ queryKey: ["recurring", userId] }),
    queryClient.invalidateQueries({ queryKey: ["cashFlow", userId] }),
    queryClient.invalidateQueries({ queryKey: ["forecast", userId] }),
    queryClient.invalidateQueries({ queryKey: ["financialHealth", userId] }),
  ]);
};
