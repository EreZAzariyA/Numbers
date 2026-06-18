import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslation } from "react-i18next";
import { App } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { BankAccountModel } from "../models/bank-model";
import bankServices from "../services/banks";
import socketService from "../services/socket";
import { getCompanyName, getError, getTimeToRefresh } from "../utils/helpers";
import { invalidateFinancialQueries } from "../utils/queryInvalidation";

dayjs.extend(relativeTime);

const MULTI_REFRESH_CONCURRENCY = 2;

interface UseBankRefreshProps {
  banks: BankAccountModel[];
  userId: string;
}

const cloneBanks = (banks: BankAccountModel[]) => [...banks];

export const useBankRefresh = ({ banks, userId }: UseBankRefreshProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [scrapingJobId, setScrapingJobId] = useState<string | null>(null);
  const [scrapingBankName, setScrapingBankName] = useState<string | undefined>(undefined);

  const lastConnection = useMemo(() => {
    const snapshot = cloneBanks(banks);
    if (!snapshot.length) {
      return null;
    }

    return snapshot
      .sort((a, b) => (b?.lastConnection || 0) - (a?.lastConnection || 0))[0]
      ?.lastConnection || null;
  }, [banks]);

  const timeLeftToRefreshData = useMemo(() => {
    return lastConnection ? getTimeToRefresh(lastConnection) : null;
  }, [lastConnection]);

  const isRefreshAvailable = !timeLeftToRefreshData || dayjs().isAfter(timeLeftToRefreshData);

  const invalidateBanks = useCallback(async () => {
    await invalidateFinancialQueries(queryClient, userId);
  }, [queryClient, userId]);

  const waitForJob = useCallback((jobId: string) => {
    return new Promise<void>((resolve, reject) => {
      let unsubComplete: () => void = () => undefined;
      let unsubFailed: () => void = () => undefined;

      const cleanup = () => {
        unsubComplete();
        unsubFailed();
      };

      unsubComplete = socketService.on("scraping:complete", (data: any) => {
        if (data.jobId !== jobId) return;
        cleanup();
        resolve();
      });

      unsubFailed = socketService.on("scraping:failed", (data: any) => {
        if (data.jobId !== jobId) return;
        cleanup();
        reject(new Error(data.error || t("bank.refreshError")));
      });
    });
  }, [t]);

  const requestRefreshJob = useCallback(async (bank: BankAccountModel) => {
    return bankServices.refreshBankData(userId, bank._id);
  }, [userId]);

  const startSingleRefresh = useCallback(async (bank: BankAccountModel) => {
    setLoading(true);
    const { jobId } = await requestRefreshJob(bank);
    setScrapingBankName(getCompanyName(bank.bankName));
    setScrapingJobId(jobId);
  }, [requestRefreshJob]);

  const refreshManyBanks = useCallback(async (banksToRefresh: BankAccountModel[]) => {
    if (!banksToRefresh.length) {
      return;
    }

    setLoading(true);
    const queue = cloneBanks(banksToRefresh);
    let hasSuccessfulRefresh = false;

    const worker = async () => {
      while (queue.length) {
        const bank = queue.shift();
        if (!bank) {
          return;
        }

        try {
          const { jobId } = await requestRefreshJob(bank);
          await waitForJob(jobId);
          hasSuccessfulRefresh = true;
          message.success(t("bank.refreshSuccess", { name: getCompanyName(bank.bankName) }));
        } catch (error: any) {
          message.error(getError(error) || t("bank.refreshError"));
        }
      }
    };

    try {
      const workerCount = Math.min(MULTI_REFRESH_CONCURRENCY, queue.length);
      await Promise.all(Array.from({ length: workerCount }, () => worker()));

      if (hasSuccessfulRefresh) {
        await invalidateBanks();
      }
    } finally {
      setLoading(false);
    }
  }, [invalidateBanks, message, requestRefreshJob, t, waitForJob]);

  const handleSingleRefreshComplete = useCallback(async () => {
    await invalidateBanks();
    setLoading(false);
  }, [invalidateBanks]);

  const handleSingleRefreshFailure = useCallback(() => {
    setLoading(false);
  }, []);

  const clearRefreshState = useCallback(() => {
    setScrapingJobId(null);
    setScrapingBankName(undefined);
    setLoading(false);
  }, []);

  return {
    clearRefreshState,
    handleSingleRefreshComplete,
    handleSingleRefreshFailure,
    isRefreshAvailable,
    loading,
    refreshManyBanks,
    scrapingBankName,
    scrapingJobId,
    startSingleRefresh,
    timeLeftToRefreshData,
  };
};
