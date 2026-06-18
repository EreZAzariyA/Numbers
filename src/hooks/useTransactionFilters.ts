import { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSearchParams } from "react-router-dom";
import { TransactionStatuses, TransactionsType } from "../utils/transactions";

const MONTH_PARAM_FORMAT = "YYYY-MM";
const DATE_PARAM_FORMAT = "YYYY-MM-DD";
const EMPTY_MONTH_VALUE = "none";
const ALL_STATUS_VALUE = "all";

dayjs.extend(customParseFormat);

export interface TransactionFilterState {
  byIncome: "income" | "spent" | null;
  cardNumber: string | null;
  categories: string[];
  companyId: string | null;
  dates: [Dayjs, Dayjs] | null;
  month: Dayjs | null;
  status: TransactionStatuses | null;
  text: string;
  type: TransactionsType;
}

export type TransactionFilterUpdater =
  | TransactionFilterState
  | ((current: TransactionFilterState) => TransactionFilterState);

export type SetTransactionFilterState = (updater: TransactionFilterUpdater) => void;

const parseMonth = (value: string | null) => {
  if (!value) {
    return dayjs();
  }
  if (value === EMPTY_MONTH_VALUE) {
    return null;
  }

  const parsedMonth = dayjs(value, MONTH_PARAM_FORMAT, true);
  return parsedMonth.isValid() ? parsedMonth : dayjs();
};

const parseDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsedDate = dayjs(value, DATE_PARAM_FORMAT, true);
  return parsedDate.isValid() ? parsedDate : null;
};

const sanitizeTransactionFilters = (filters: TransactionFilterState): TransactionFilterState => {
  const nextFilters: TransactionFilterState = {
    byIncome: filters.byIncome === "income" || filters.byIncome === "spent" ? filters.byIncome : null,
    cardNumber: filters.cardNumber ? String(filters.cardNumber) : null,
    categories: Array.isArray(filters.categories) ? filters.categories.filter(Boolean) : [],
    companyId: filters.companyId || null,
    dates: filters.dates?.length === 2 ? filters.dates : null,
    month: filters.month ?? null,
    status: filters.status ?? null,
    text: filters.text || "",
    type: filters.type === TransactionsType.CARD_TRANSACTIONS
      ? TransactionsType.CARD_TRANSACTIONS
      : TransactionsType.ACCOUNT,
  };

  if (nextFilters.dates) {
    nextFilters.month = null;
  }

  if (nextFilters.type !== TransactionsType.CARD_TRANSACTIONS) {
    nextFilters.cardNumber = null;
  }

  return nextFilters;
};

const parseTransactionFilters = (searchParams: URLSearchParams): TransactionFilterState => {
  const dateFrom = parseDate(searchParams.get("dateFrom"));
  const dateTo = parseDate(searchParams.get("dateTo"));
  const dates = dateFrom && dateTo ? [dateFrom, dateTo] as [Dayjs, Dayjs] : null;
  const statusParam = searchParams.get("status");
  const typeParam = searchParams.get("type");
  const byIncomeParam = searchParams.get("byIncome");

  return sanitizeTransactionFilters({
    byIncome: byIncomeParam === "income" || byIncomeParam === "spent" ? byIncomeParam : null,
    cardNumber: searchParams.get("cardNumber"),
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    companyId: searchParams.get("companyId"),
    dates,
    month: dates ? null : parseMonth(searchParams.get("month")),
    status: statusParam === ALL_STATUS_VALUE
      ? null
      : Object.values(TransactionStatuses).includes(statusParam as TransactionStatuses)
        ? statusParam as TransactionStatuses
        : TransactionStatuses.completed,
    text: searchParams.get("text") || "",
    type: typeParam === TransactionsType.CARD_TRANSACTIONS
      ? TransactionsType.CARD_TRANSACTIONS
      : TransactionsType.ACCOUNT,
  });
};

export const getDefaultTransactionFilterState = (): TransactionFilterState => ({
  byIncome: null,
  cardNumber: null,
  categories: [],
  companyId: null,
  dates: null,
  month: dayjs(),
  status: TransactionStatuses.completed,
  text: "",
  type: TransactionsType.ACCOUNT,
});

const serializeTransactionFilters = (filters: TransactionFilterState) => {
  const params = new URLSearchParams();
  const defaultFilters = getDefaultTransactionFilterState();

  if (filters.dates) {
    params.set("dateFrom", filters.dates[0].format(DATE_PARAM_FORMAT));
    params.set("dateTo", filters.dates[1].format(DATE_PARAM_FORMAT));
  } else if (filters.month === null) {
    params.set("month", EMPTY_MONTH_VALUE);
  } else if (filters.month && !filters.month.isSame(defaultFilters.month, "month")) {
    params.set("month", filters.month.format(MONTH_PARAM_FORMAT));
  }

  if (filters.status === null) {
    params.set("status", ALL_STATUS_VALUE);
  } else if (filters.status && filters.status !== defaultFilters.status) {
    params.set("status", filters.status);
  }

  if (filters.type !== defaultFilters.type) {
    params.set("type", filters.type);
  }

  if (filters.cardNumber) {
    params.set("cardNumber", filters.cardNumber);
  }

  if (filters.categories.length) {
    params.set("categories", filters.categories.join(","));
  }

  if (filters.companyId) {
    params.set("companyId", filters.companyId);
  }

  if (filters.text) {
    params.set("text", filters.text);
  }

  if (filters.byIncome) {
    params.set("byIncome", filters.byIncome);
  }

  return params;
};

export const useTransactionFilters = (): [TransactionFilterState, SetTransactionFilterState] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterState = useMemo(() => {
    return parseTransactionFilters(searchParams);
  }, [searchParams]);

  const setFilterState: SetTransactionFilterState = (updater) => {
    const currentFilters = parseTransactionFilters(searchParams);
    const nextFilters = typeof updater === "function"
      ? updater(currentFilters)
      : updater;

    setSearchParams(serializeTransactionFilters(sanitizeTransactionFilters(nextFilters)));
  };

  return [filterState, setFilterState];
};
