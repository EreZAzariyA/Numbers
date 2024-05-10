import { UserBankModel } from "../models/user-model";
import { CompanyTypes } from "./definitions";

export enum TransactionStatuses {
  completed = "Completed",
  pending = "Pending"
};

export declare enum TransactionTypes {
  Normal = "normal",
  Installments = "installments"
};

export interface TransactionsAccount {
  accountNumber: string;
  balance?: number;
  txns: Transaction[];
}

export interface BankAccountDetails {
  userBank: UserBankModel;
  account: TransactionsAccount;
  newUserToken: string;
}

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
  companyId: CompanyTypes;
}