import { useEffect, useState } from "react";
import TransactionModel from "../models/transaction";
import dayjs, { Dayjs } from "dayjs";
import store from "../redux/store";
import { CategoryData } from "./interfaces";
import { TransactionStatusesType } from "./transactions";
import UserModel from "../models/user-model";
import CategoryModel from "../models/category-model";
import { SupportedCompaniesTypes, SupportedScrapers } from "./definitions";
import { BankAccountModel } from "../models/bank-model";
import { ThemeColors } from "./enums";
import { PastOrFutureDebitType } from "./types";

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
  return isArray(arr) && arr.length > 0;
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

export const getInvoicesBySelectedMonth = (transactions: TransactionModel[], selectedMonth: Dayjs): TransactionModel[] => {
  const transactionsByMonth: TransactionModel[] = [];
  if (isArrayAndNotEmpty(transactions)) {
    transactions.forEach((i) => {
      const transactionDate = dayjs(i.date).format('YYYY-MM');
      if (transactionDate === selectedMonth?.format('YYYY-MM')) {
        transactionsByMonth.push(i);
      }
    });
  }
  return transactionsByMonth;
};

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
  let arr;

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
      transactionsByCategory[category.name] = totalAmount
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

export const setCategoriesAndInvoicesArray = (categories: CategoryModel[], transactions: TransactionModel[]) => {
  const categoryMap = new Map();
  categories.forEach(category => {
    categoryMap.set(category._id, category.name);
  });

  const categoryInvoiceAmounts: any = {};
  transactions.forEach(transaction => {
    const categoryName = categoryMap.get(transaction.category_id);
    if (!categoryInvoiceAmounts[categoryName]) {
        categoryInvoiceAmounts[categoryName] = 0;
    }
    categoryInvoiceAmounts[categoryName] += transaction.amount;
  });

  const result = Object.entries(categoryInvoiceAmounts).map(([name, amount]) => ({
    name,
    value: Math.abs(asNumber(amount as number))
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

export const getDebitsByDate = (account: BankAccountModel, selectedMonth: Dayjs): Partial<PastOrFutureDebitType> => {
  if (!isArrayAndNotEmpty(account?.pastOrFutureDebits)) {
    return;
  };

  return account.pastOrFutureDebits.find((debit) => {
    const date = getDataFromStringDate(debit.debitMonth);
    return date === selectedMonth.format('MM-YYYY');
  });
}

const getDataFromStringDate = (stringDate: string): string => {
  const month = parseInt(stringDate.substring(0, 2)) - 1;
  const year = parseInt(stringDate.substring(2));
  return dayjs().set('year', year).set('month', month).format('MM-YYYY');
}