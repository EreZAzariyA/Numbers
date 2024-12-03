import { useEffect, useState } from "react";
import TransactionModel from "../models/transaction";
import dayjs, { Dayjs } from "dayjs";
import store from "../redux/store";
import { CategoryData } from "./interfaces";
import { TransactionStatusesType } from "./transactions";
import UserModel from "../models/user-model";
import CategoryModel from "../models/category-model";
import { SupportedCompaniesTypes, SupportedScrapers } from "./definitions";
import { BankAccountModel, MainBanksAccount } from "../models/bank-model";
import { ThemeColors } from "./enums";
import { CreditCardType, PastOrFutureDebitType } from "./types";

export type ColorType = {
  ICON: string;
  DANGER: string;
};
export const Colors: ColorType  = {
  ICON: '#08c',
  DANGER: 'red'
};

export type SizeType = {
  ICON: number;
  TOP_MENU_ICON: number;
  MENU_ICON: number;
  SUB_MENU_ICON: number;
}
export const Sizes: SizeType = {
  ICON: 25,
  TOP_MENU_ICON: 20,
  MENU_ICON: 25,
  SUB_MENU_ICON: 20
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals",
  Last_Transactions = "Transactions"
};

const getStyle = (theme: string): string => {
  if (theme === ThemeColors.LIGHT) {
    return 'black';
  } else if (theme === ThemeColors.DARK) {
    return Colors.ICON;
  }
};

export const getStyleForTheme = (component: string, themeColor: string): string => {
  let color = '';
  switch (component) {
    case 'icon':
      color = getStyle(themeColor);
    break;

  }

  return color;
}

export const useResize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 501,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth <= 992,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        isPhone: window.innerWidth <= 500,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth <= 992
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

export const isArray = (arr: any[]): boolean => {
  return Array.isArray(arr);
};
export const isArrayAndNotEmpty = (arr: any[]): boolean => {
  return isArray(arr) && arr?.length > 0;
};

export const getError = (err: any) => {
  if(typeof err === "string") return err;
  if(typeof err.response?.data === "string") return err.response.data; // axios: 401, 403, 500
  if(Array.isArray(err.response?.data)) return err.response.data[0]; // axios: 400 - array of errors
  if(typeof err.message === "string") return err.message;
  return "Some error, please try again.";
};

export const asNumber = (num: number, digits: number = 2) => (
  parseFloat(num?.toFixed(digits)) || 0
);

export const asNumString = (num: number = 0, digits: number = 2): string => {
  if (!num || typeof num !== 'number') {
    return '0'
  }
  const formattedNumber = num?.toFixed(digits);
  return parseFloat(formattedNumber || '0').toLocaleString();
};

export const getInvoicesBySelectedMonth = (transactions: TransactionModel[], selectedMonth: Dayjs, status?: string): TransactionModel[] => {
  const transactionsByMonth: TransactionModel[] = [];
  if (isArrayAndNotEmpty(transactions)) {
    transactions.forEach((i) => {
      if (status && i.status !== status) return;
      if (i.status !== TransactionStatusesType.COMPLETED) return;

      const transactionDate = dayjs(i.date).format('YYYY-MM');
      if (transactionDate === selectedMonth?.format('YYYY-MM')) {
        transactionsByMonth.push(i);
      }
    });
  }
  return transactionsByMonth;
};

export const getAccountCreditCards = (mainAccount: MainBanksAccount): CreditCardType[] => {
  const banks = mainAccount?.banks;
  if (!isArrayAndNotEmpty(banks)) {
    return [];
  }

  const creditCards: CreditCardType[] = [];
  for (const bank of banks) {
    if (isArrayAndNotEmpty(bank?.creditCards)) {
      bank.creditCards.forEach((card) => {
        creditCards.push(card);
      });
    }
  }

  return creditCards;
}

export const getTotals = (arr: number[]): number => {
  let total = 0;
  if (isArrayAndNotEmpty(arr)) {
    total = arr.reduce((a, b) => a + b, 0);
    return asNumber(total);
  }
  return total;
};

export const getInvoicesTotalsPrice = (transactions: TransactionModel[], status?: TransactionStatusesType): {spent: number, income: number } => {
  const totals: number[] = [];
  const incomes: number[] = [];

  if (isArrayAndNotEmpty(transactions)) {
    let arr = [...transactions];
    if (status) {
      arr = filterInvoicesByStatus(arr, status);
    }
    arr.forEach((i) => {
      if (i.amount > 0) {
        incomes.push(i.amount);
      } else {
        totals.push(i.amount);
      }
    })
  }

  return {
    spent: getTotals(totals),
    income: getTotals(incomes)
  };
};

export const getInvoicesPricePerCategory = (transactions: TransactionModel[], status?: TransactionStatusesType) => {
  const { categories } = store.getState().categories;
  const transactionsByCategory: any = {};
  let arr = [...transactions || []];

  if (status) {
    arr = filterInvoicesByStatus(transactions, status);
  }

  if (isArrayAndNotEmpty(arr) && isArrayAndNotEmpty(categories)) {
    for (const category of categories) {
      const categoryInvoices: TransactionModel[] = [];

      arr.forEach((transaction) => {
        if (transaction.category_id === category._id) {
          categoryInvoices.push(transaction);
        }
      });
      const totalAmount = getInvoicesTotalsPrice(categoryInvoices);
      transactionsByCategory[category.name] = totalAmount;
    };
  }

  return transactionsByCategory;
};

export const getNumOfTransactionsPerCategory = (transactions: TransactionModel[], categories: CategoryModel[], status?: TransactionStatusesType) => {
  const numOfTransPerCategory: any = {};
  let arr = [...transactions];
  if (status) {
    arr = filterInvoicesByStatus(transactions, status);
  }

  if (isArrayAndNotEmpty(arr) && isArrayAndNotEmpty(categories)) {
    for (const category of categories) {
      const categoryInvoices: TransactionModel[] = [];
      let numOfTrans = 0;

      arr.forEach((transaction) => {
        if (transaction.category_id === category._id) {
          categoryInvoices.push(transaction);
          numOfTrans = numOfTrans + 1;
        }
      });
      const totalAmount = getInvoicesTotalsPrice(categoryInvoices);

      numOfTransPerCategory[category.name] = {
        totalAmount,
        numOfTrans
      }
    }
  }

  return numOfTransPerCategory;
}

export const findCategoryWithLargestSpentAmount = (data: CategoryData, status?: TransactionStatusesType): { category: string, amount: number } => {
  let maxCategory: string | null = null;
  let maxValue: number = -Infinity;

  Object.entries(data).forEach(([category, amounts]) => {
    if (Math.abs(amounts.spent) > maxValue) {
      maxValue = Math.abs(amounts.spent);
      maxCategory = category;
    }
  });
  if (maxCategory === null) {
    return null;
  }
  return { category: maxCategory, amount: maxValue };
};

export const findCategoryWithLowestAmount = (data: CategoryData, status?: TransactionStatusesType): { category: string, amount: number } | null => {
  let minCategory: string | null = null;
  let minValue: number = Infinity;

  Object.entries(data).forEach(([category, amounts]) => {
    if (Math.abs(amounts.spent) === 0) return;

    if (Math.abs(amounts.spent) < minValue) {
      minValue = Math.abs(amounts.spent);
      minCategory = category;
    }
  });

  if (minCategory === null) {
    return null;
  }
  return { category: minCategory, amount: minValue };
};

export const filterInvoicesByStatus = (transactions: TransactionModel[] = [], status: TransactionStatusesType): TransactionModel[] => {
  if (!!isArrayAndNotEmpty(transactions)) {
    return transactions.filter((i) => i.status === status).sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }
  return transactions;
};
export const filterInvoicesByCategoryId = (transactions: TransactionModel[], category_id: string): TransactionModel[] => {
  return transactions.filter((i) => i.category_id === category_id)
};

export const getTimeToRefresh = (lastConnection: number) => {
  return dayjs(lastConnection).subtract(-3, 'hour');
};

export const sortInvoices = (transactions: TransactionModel[], sortBy: 'date'): TransactionModel[] => {
  if (sortBy === 'date') {
    transactions.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
  }

  return transactions;
};

export const getGreeting = () => {
  const currentHour = dayjs().hour();
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good afternoon';
  } else if (currentHour >= 17 && currentHour < 20) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
};

export const getUserfName = (user: UserModel) => {
  if (!user) return '';
  return user.profile.first_name;
};

const getCategory = (category_id: string): CategoryModel => {
  const categories = store.getState().categories.categories;
  return categories.find((c) => c._id === category_id);
}

export const setCategoriesAndInvoicesArray = (categories: CategoryModel[], transactions: TransactionModel[]) => {
  const categoryInvoiceAmounts: Record<string, number> = {};

  transactions.forEach((transaction) => {
    const category = getCategory(transaction.category_id);
    const categoryName = category?.name;

    if (transaction?.category_id === category?._id && transaction?.amount < 0) {
      if (!categoryInvoiceAmounts[categoryName]) {
        categoryInvoiceAmounts[categoryName] = 0;
      }
      categoryInvoiceAmounts[categoryName] += transaction.amount;
    }
  });

  const result = Object.entries(categoryInvoiceAmounts).map(([name, amount]) => ({
    name,
    value: Math.abs(asNumber(amount))
  }));

  return result;
};

export const getFutureDebitDate = (dateString: string, format?: string): string => {
  const month = parseInt(dateString?.substring(0, 2)) - 1 || 0;
  const year = parseInt(dateString?.substring(2)) || 0;
  const date = new Date(year, month, 1).valueOf() || 0;

  return dayjs(date).format(format || "MM/YYYY");
};

export const getBanksTotal = (banks: BankAccountModel[]) => {
  let arr = [];

  if (!isArrayAndNotEmpty(banks)) {
    return;
  }

  for (const bank of banks) {
    if (bank?.details?.balance)
    arr.push(bank.details.balance);
  }

  return getTotals(arr) || 0;
};

export const getLoginFields = (companyId: SupportedCompaniesTypes) => {
  const company = SupportedScrapers[companyId];
  return company.loginFields;
};

export const getDebitsByDate = (account: MainBanksAccount, selectedMonth: Dayjs): Partial<PastOrFutureDebitType[]> => {
  const banks = account?.banks;
  const debits: Partial<PastOrFutureDebitType[]> = [];
  if (!isArrayAndNotEmpty(banks)) return debits;

  for (const bank of banks) {
    if (!isArrayAndNotEmpty(bank?.pastOrFutureDebits)) {
      continue;
    };

    const debit = bank.pastOrFutureDebits.find((debit) => {
      const date = getDataFromStringDate(debit.debitMonth);
      return date === selectedMonth.format('MM-YYYY');
    });

    debits.push(debit);
  }

  return debits
}

const getDataFromStringDate = (stringDate: string): string => {
  const month = parseInt(stringDate.substring(0, 2)) - 1;
  const year = parseInt(stringDate.substring(2));
  return dayjs().set('year', year).set('month', month).format('MM-YYYY');
};

export const getTransactionsByCategory = (categoryId: string, status?: string, sentTransactions?: TransactionModel[]): TransactionModel[] => {
  const trans = sentTransactions || store.getState().transactions.transactions;
  const transactions: TransactionModel[] = [];

  for (const transaction of trans) {
    if (transaction.category_id === categoryId) {
      if (status && transaction.status !== status) return;
      transactions.push(transaction);
    }
  }

  return transactions;
};

export const filtering = (transactions: TransactionModel[] = [], filterState: any): TransactionModel[] => {
  let data = [...transactions];

  if (!isArrayAndNotEmpty(transactions)) {
    return [];
  }
  if (isArrayAndNotEmpty(filterState.categories)) {
    data = [...data].filter((d) => filterState.categories.includes(d.category_id));
  }
  if (filterState.companyId) {
    data = [...data].filter((d) => d.companyId === filterState.companyId);
  }
  if (filterState.dates && filterState.dates.length === 2) {
    data = [...data].filter((d) => (
      dayjs(d.date).valueOf() >= dayjs(filterState.dates[0]).startOf('day').valueOf() &&
      dayjs(d.date).valueOf() <= dayjs(filterState.dates[1]).endOf('day').valueOf()
    ));
  }
  if (filterState.month) {
    data = [...data].filter((d) => (
      dayjs(d.date).valueOf() >= dayjs(filterState.month).startOf('month').valueOf() &&
      dayjs(d.date).valueOf() <= dayjs(filterState.month).endOf('month').valueOf()
    ));
  }
  if (filterState.status) {
    data = [...data].filter((d) => d.status === filterState.status);
  }
  if (filterState.text) {
    data = [...data].filter((d) => d.description.startsWith(filterState.text));
  }
  if (filterState.byIncome) {
    const byIncome = filterState.byIncome === 'income';
    data = [...data].filter((d) => (byIncome ? d.amount > 0 : d.amount < 0));
  }

  return data;
};