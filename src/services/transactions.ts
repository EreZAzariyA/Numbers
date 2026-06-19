import axios from "axios";
import TransactionModel from "../models/transaction";
import config from "../utils/config";
import { TransactionsType, TransType } from "../utils/transactions";
import CardTransactionModel from "../models/card-transaction";
import { RecurringGroup, ForecastResponse, FinancialHealthResponse, CashFlowProjectionResponse } from "../utils/types";

export type MainTransaction = TransactionModel | CardTransactionModel;
export type TransactionsResp = {
  transactions: MainTransaction[],
  total: number
}

export interface CategoryChange {
  category: string;
  current: number;
  previous: number;
  delta: number;
  deltaPct: number | null;
}

export interface SpendingComparisonResponse {
  current: { start: string; end: string; total: number };
  previous: { start: string; end: string; total: number };
  totalDelta: number;
  totalDeltaPct: number | null;
  topCategoryChanges: CategoryChange[];
}

export interface SubscriptionSummary {
  patternId: string;
  merchantKey: string;
  name: string;
  frequency: string;
  currentAmount: number;
  previousAmount: number | null;
  priceChangePct: number | null;
  monthlyEquivalent: number;
  lastSeen: string;
  nextExpected: string | null;
  isStale: boolean;
}

export interface SubscriptionsResponse {
  subscriptions: SubscriptionSummary[];
  monthlyTotal: number;
  priceIncreaseCount: number;
  staleCount: number;
}

class TransactionsServices {
  fetchTransactions = async (
    user_id: string,
    query?: object,
    type: TransType = TransactionsType.ACCOUNT
  ): Promise<TransactionsResp> => {
    const response = await axios.get<TransactionsResp>(
      config.urls.transactions + user_id,
      { params: { query, type } }
    );

    const { transactions = [], total = 0 } = response.data;
    return { transactions, total };
  };

  addTransaction = async (user_id: string, transaction: MainTransaction, type: TransactionsType = TransactionsType.ACCOUNT): Promise<MainTransaction> => {
    const response = await axios.post<MainTransaction>(config.urls.transactions + `/${user_id}`, { transaction, type });
    const addedTransaction = response.data;
    return addedTransaction;
  };

  updateTransaction = async (user_id: string, transaction: MainTransaction, type: TransactionsType = TransactionsType.ACCOUNT): Promise<MainTransaction> => {
    const response = await axios.put<TransactionModel | CardTransactionModel>(config.urls.transactions + `/${user_id}`, { transaction, type });
    const updatedTransaction = response.data;
    return updatedTransaction;
  };

  removeTransaction = async (user_id: string, transaction_id: string, type: TransactionsType): Promise<void> => {
    await axios.delete<void>(config.urls.transactions, {
      data: {
        user_id,
        transaction_id,
        type
      }
    });
  };

  importTransactions = async (user_id: string, transactions: MainTransaction[], companyId: string) => {
    const response = await axios.post<MainTransaction[]>(config.urls.bank.importTransactions + `/${user_id}`, { transactions, companyId });
    const insertedTransactions = response.data;
    return insertedTransactions;
  };

  fetchRecurringTransactions = async (user_id: string): Promise<RecurringGroup[]> => {
    const response = await axios.get<RecurringGroup[]>(config.urls.recurringTransactions + user_id);
    return response.data;
  };

  fetchForecast = async (user_id: string, language: string = 'en'): Promise<ForecastResponse> => {
    const response = await axios.get<ForecastResponse>(config.urls.forecast + user_id, { params: { language } });
    return response.data;
  };

  fetchFinancialHealth = async (user_id: string, language: string = 'en'): Promise<FinancialHealthResponse> => {
    const response = await axios.get<FinancialHealthResponse>(config.urls.financialHealth + user_id, { params: { language } });
    return response.data;
  };

  fetchCashFlowProjection = async (user_id: string, force = false): Promise<CashFlowProjectionResponse> => {
    const response = await axios.get<CashFlowProjectionResponse>(config.urls.cashFlow + user_id, {
      params: force ? { force: 'true' } : undefined,
    });
    return response.data;
  };

  fetchSpendingComparison = async (user_id: string, force = false): Promise<SpendingComparisonResponse> => {
    const response = await axios.get<SpendingComparisonResponse>(`${config.urls.cashFlow}${user_id}/comparison`, {
      params: force ? { force: 'true' } : undefined,
    });
    return response.data;
  };

  fetchSubscriptions = async (user_id: string): Promise<SubscriptionsResponse> => {
    const response = await axios.get<SubscriptionsResponse>(`${config.urls.subscriptions}${user_id}/subscriptions`);
    return response.data;
  };
}

const transactionsServices = new TransactionsServices();
export default transactionsServices;