import { BankAccountModel, CardNumberType } from "../models/bank-model";
import TransactionModel from "../models/transaction";
import { SupportedCompaniesTypes } from "./definitions";
import { AccountInfoType, AccountSavesType, CardsPastOrFutureDebitType, CreditCardType, PastOrFutureDebitType } from "./types";

export enum TransactionStatuses {
  completed = "Completed",
  pending = "Pending"
};
export enum TransactionStatusesType {
  COMPLETED = "completed",
  PENDING = "pending"
};

declare enum TransactionTypes {
  Normal = "normal",
  Installments = "installments"
};

export interface BankAccount {
  accountNumber: string;
  cardNumber: CardNumberType;
  balance?: number;
  txns: Transaction[];
  info?: Partial<AccountInfoType>;
  pastOrFutureDebits?: Partial<PastOrFutureDebitType[]>;
  cardsPastOrFutureDebit?: CardsPastOrFutureDebitType;
  saving?: AccountSavesType;
  creditCards: CreditCardType[];
};

export interface RefreshedBankAccountDetails {
  bank: BankAccountModel;
  account: BankAccount;
  importedTransactions?: TransactionModel[];
};

export interface Transaction {
  type: TransactionTypes;
  identifier?: string | number;
  date: string;
  processedDate: string;
  originalAmount: number;
  originalCurrency: string;
  chargedAmount: number;
  chargedCurrency?: string;
  description: string;
  memo?: string;
  status: TransactionStatuses;
  category?: string;
  cardNumber: CardNumberType;
};

export declare type ScraperCredentials = {
  userCode: string;
  password: string;
} | {
  username: string;
  password: string;
} | {
  id: string;
  password: string;
} | {
  id: string;
  password: string;
  num: string;
} | {
  id: string;
  password: string;
  card6Digits: string;
} | {
  username: string;
  nationalID: string;
  password: string;
} | ({
  email: string;
  password: string;
} & ({
  otpCodeRetriever: () => Promise<string>;
  phoneNumber: string;
} | {
  otpLongTermToken: string;
}));


export interface ScraperOptions {
  companyId: SupportedCompaniesTypes;
}