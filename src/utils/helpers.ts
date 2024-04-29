import { useEffect, useState } from "react";
import UserModel from "../models/user-model";
import Role from "../models/role";
import { ThemeColors } from "../redux/slicers/theme-slicer";
import InvoiceModel from "../models/invoice";
import dayjs, { Dayjs } from "dayjs";
import store from "../redux/store";

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

export const isAdmin = (user: UserModel) => {
  return user?.role === Role.Admin;
};

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

export const getInvoicesBySelectedMonth = (invoices: InvoiceModel[], monthToDisplay: Dayjs): InvoiceModel[] => {
  let monthInvoices: InvoiceModel[] = [];
  invoices.forEach((i) => {
    const invoiceDate = dayjs(i.date).format('MMMM');
    if (invoiceDate === monthToDisplay?.format('MMMM')) {
      monthInvoices.push(i);
    }
  });
  return monthInvoices;
};

export const getTotals = (arr: number[]): number => {
  const total = arr?.reduce((a, b) => a + b, 0);
  return asNumber(total);
};


export const getInvoicesTotalsPrice = (invoices: InvoiceModel[]): {spent: number, income: number } => {
  let totals: number[] = [];
  let incomes: number[] = [];

  invoices.forEach((i) => {
    if (i.amount > 0) {
      incomes.push(i.amount);
    } else {
      totals.push(i.amount);
    }
  })

  return {
    spent: getTotals(totals),
    income: getTotals(incomes)
  };
};

export const getInvoicesPricePerCategory = (invoices: InvoiceModel[]) => {
  const categories = store.getState().categories;
  let invoicesByCategory: any = {};

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
  return invoicesByCategory;
};

interface CategoryData {
  [category: string]: {
    spent: number,
    income: number
  };
}

export const findCategoryWithLargestAmount = (data: CategoryData): { category: string, amount: number } => {
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