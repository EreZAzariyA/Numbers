import { useEffect, useState } from "react";
import { ThemeColors } from "../redux/slicers/theme-slicer";
import InvoiceModel from "../models/invoice";
import dayjs, { Dayjs } from "dayjs";
import store from "../redux/store";
import { CategoryData } from "./interfaces";
import { WithdrawalsListTypes } from "./types";
import { TransactionsTypes } from "./enums";
import { TransactionStatusesType } from "./transactions";
import UserModel from "../models/user-model";

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

export const Languages = {
  English: 'en',
  Hebrew: 'he'
}

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

export const asNumString = (num: number, digits: number = 2): string => {
  if (!num || typeof num !== 'number') {
    return '0'
  }
  const formattedNumber = num.toFixed(digits);
  return parseFloat(formattedNumber).toLocaleString();
};

export const getInvoicesBySelectedMonth = (invoices: InvoiceModel[], selectedMonth: Dayjs): InvoiceModel[] => {
  let invoicesByMonth: InvoiceModel[] = [];
  if (isArrayAndNotEmpty(invoices)) {
    invoices.forEach((i) => {
      const invoiceDate = dayjs(i.date).format('YYYY-MM');
      if (invoiceDate === selectedMonth?.format('YYYY-MM')) {
        invoicesByMonth.push(i);
      }
    });
  }
  return invoicesByMonth;
};

export const getTotals = (arr: number[]): number => {
  let total = 0;
  if (isArrayAndNotEmpty(arr)) {
    total = arr.reduce((a, b) => a + b, 0);
    return asNumber(total);
  }
  return total;
};

export const getInvoicesTotalsPrice = (invoices: InvoiceModel[]): {spent: number, income: number } => {
  let totals: number[] = [];
  let incomes: number[] = [];

  if (isArrayAndNotEmpty(invoices)) {
    invoices.forEach((i) => {
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

export const getInvoicesPricePerCategory = (invoices: InvoiceModel[]) => {
  const categories = store.getState().categories;
  let invoicesByCategory: any = {};

  if (isArrayAndNotEmpty(invoices) && isArrayAndNotEmpty(categories)) {
    for (let category of categories) {
      const categoryInvoices: InvoiceModel[] = [];
  
      invoices.forEach((invoice) => {
        if (invoice.category_id === category._id){
          categoryInvoices.push(invoice);
        }
      });
      const totalAmount = getInvoicesTotalsPrice(categoryInvoices);
      invoicesByCategory[category.name] = totalAmount
    };
  }

  return invoicesByCategory
};

export const findCategoryWithLargestSpentAmount = (data: CategoryData): { category: string, amount: number } => {
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

export const findCategoryWithLowestAmount = (data: CategoryData): { category: string, amount: number } | null => {
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

export const filterInvoicesByType = (invoices: InvoiceModel[], type?: TransactionsTypes, status?: TransactionStatusesType): InvoiceModel[] => {
  const list = WithdrawalsListTypes[type] || [type];
  let arr = [...invoices];
  if (type) {
    arr = arr.filter((invoice) => ([...list].some((type) => invoice.description.includes(type))));
  }
  if (status) {
    arr = arr.filter((invoice) => (invoice.status === status))
  }
  
  arr = sortInvoices(arr, 'date');
  return arr;
};
export const filterInvoicesByListTypes = (invoices: InvoiceModel[], types: TransactionsTypes[]): InvoiceModel[] => {
  let arr = [...invoices];

  for (let type of types) {
    const list = WithdrawalsListTypes[type] || [type];
    if (type) {
      arr = arr.filter((invoice) => ([...list].some((type) => invoice.description.includes(type))));
    }
  }
  
  arr = sortInvoices(arr, 'date');
  return arr;
};

export const getTimeToRefresh = (lastConnection: number) => {
  return dayjs(lastConnection).subtract(-5, 'hour');
};

export const sortInvoices = (invoices: InvoiceModel[], sortBy: 'date'): InvoiceModel[] => {
  if (sortBy === 'date') {
    invoices.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
  }

  return invoices;
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