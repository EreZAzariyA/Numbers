import { Languages, ThemeColors } from "./enums";

export type LanguageType = typeof Languages[keyof typeof Languages];
export type ThemeColorType = ThemeColors.LIGHT | ThemeColors.DARK;
export type CreditCardFrameworkType = Record<string, { cardFramework: number, cardFrameworkUsed: number }>;

export type AccountInfoType = {
  accountName: string;
  accountAvailableBalance: number;
  accountBalance: number;
  accountStatusCode: string;
  accountCurrencyCode: string;
  accountCurrencyLongName: string;
  handlingBranchID: string;
  handlingBranchName: string;
  privateBusinessFlag: string;
};

export type PastOrFutureDebitType = {
  debitMonth: string;
  monthlyNumberOfTransactions: number;
  monthlyNISDebitSum: number;
  monthlyUSDDebitSum: number;
  monthlyEURDebitSum: number;
};

export type CreditCardType = {
  cardFamilyDescription: string;
  cardFrameworkNotUsed: number;
  cardFramework: number;
  cardFrameworkUsed: number;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  cardStatusCode: number;
  cardName: string;
  cardNumber: string;
  cardTypeDescription: string;
  cardValidityDate: string;
  dateOfUpcomingDebit: string;
  NISTotalDebit: number;
  USDTotalDebit: number;
  EURTotalDebit: number;
};

export type PastOrFutureDebits = {
  debitMonth: string;
  monthlyNumberOfTransactions: number;
  monthlyNISDebitSum: number;
  monthlyUSDDebitSum: number;
  monthlyEURDebitSum: number;
};

export interface AccountSavesType {
  businessDate: string;
  totalDepositsCurrentValue: number;
  currencyCode: string;
};

export type BankCredential = {
  companyId: string,
  id: string,
  password: string,
  num: string,
  save: boolean,
  username: string
};