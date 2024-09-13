import { BankAccount } from "../utils/transactions";
import { AccountInfoType, AccountSavesType, CreditCardType, PastOrFutureDebitType } from "../utils/types";

export interface BankAccountDetails {
  bank: MainBanksAccount;
  account: BankAccount;
};
export interface MainBanksAccount {
  _id: string;
  userId: string;
  banks: BankAccountModel[],
};

export class BankAccountModel {
  _id: string;
  userId: string;
  isMainAccount: boolean;
  bankName: string;
  credentials: string;
  details: {
    accountNumber: string;
    balance: number;
  };
  lastConnection: number;
  extraInfo: AccountInfoType;
  pastOrFutureDebits: PastOrFutureDebitType[];
  creditCards: CreditCardType[];
  savings: AccountSavesType;
  createdAt: Date;
  updatedAt: Date;

  constructor(bankAccount: BankAccountModel) {
    this._id = bankAccount._id;
    this.userId = bankAccount.userId;
    this.isMainAccount = bankAccount.isMainAccount;
    this.bankName = bankAccount.bankName;
    this.credentials = bankAccount.credentials;
    this.details = bankAccount.details;
    this.lastConnection = bankAccount.lastConnection;
    this.extraInfo = bankAccount.extraInfo;
    this.pastOrFutureDebits = bankAccount.pastOrFutureDebits;
    this.creditCards = bankAccount.creditCards;
    this.savings = bankAccount.savings;
    this.createdAt = bankAccount.createdAt;
    this.updatedAt = bankAccount.updatedAt;
  }
};