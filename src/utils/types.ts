import { Languages, ThemeColors } from "./enums";
import { BankAccountDetails } from "./transactions";

export type AccountDetails = Pick<BankAccountDetails, "account" | "bank">;
export type LanguageType = typeof Languages[keyof typeof Languages];
export type ThemeColorType = typeof ThemeColors[keyof typeof ThemeColors];


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
  cardFrameworkUsed: number;
  cardHolderFirstName: string;
  cardHolderLastName: string;
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