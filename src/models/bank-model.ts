import { Transaction } from "../utils/transactions";
import { AccountInfoType, AccountSavesType, CardsPastOrFutureDebitType, MainLoansType, PastOrFutureDebitType } from "../utils/types";

export type CardNumberType = string | number;

export interface MainBanksAccount {
  _id: string;
  user_id: string;
  banks: BankAccountModel[],
};

export class BankAccountModel {
  _id: string;
  user_id: string;
  isMainAccount: boolean;
  isCardProvider: boolean;
  bankName: string;
  credentials: string;
  details: {
    accountNumber: string;
    cardNumber: CardNumberType;
    balance: number;
  };
  lastConnection: number;
  extraInfo: AccountInfoType;
  pastOrFutureDebits: PastOrFutureDebitType[];
  cardsPastOrFutureDebit: CardsPastOrFutureDebitType;
  savings: AccountSavesType;
  loans: MainLoansType;
  createdAt: Date;
  updatedAt: Date;

  constructor(bankAccount: BankAccountModel) {
    this._id = bankAccount._id;
    this.user_id = bankAccount.user_id;
    this.isMainAccount = bankAccount.isMainAccount;
    this.bankName = bankAccount.bankName;
    this.credentials = bankAccount.credentials;
    this.details = bankAccount.details;
    this.lastConnection = bankAccount.lastConnection;
    this.extraInfo = bankAccount.extraInfo;
    this.pastOrFutureDebits = bankAccount.pastOrFutureDebits;
    this.cardsPastOrFutureDebit = bankAccount.cardsPastOrFutureDebit;
    this.savings = bankAccount.savings;
    this.loans = bankAccount.loans;
    this.createdAt = bankAccount.createdAt;
    this.updatedAt = bankAccount.updatedAt;
  }
};