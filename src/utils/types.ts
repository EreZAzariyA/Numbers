import { Languages, ThemeColors } from "./enums";
import { Transaction } from "./transactions";

export type LanguageType = typeof Languages[keyof typeof Languages];
export type ThemeColorType = ThemeColors.LIGHT | ThemeColors.DARK;
export type CreditCardFrameworkType = Record<string, { cardFramework: number, cardFrameworkUsed: number }>;

export enum CardStatusCode {
  Active = 0,
  Disable = 9
};

export interface TransactionsAccountResponse {
  accountNumber?: string;
  balance?: number;
  txns?: Transaction[];
  info?: AccountInfoType;
  pastOrFutureDebits?: PastOrFutureDebitType[];
  cardsPastOrFutureDebit?: Partial<CardsPastOrFutureDebitType>;
  saving?: AccountSavesType;
  loans?: MainLoansType;
}

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
  _id: string;
  txns?: Transaction[];
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
  cardImage?: string;
  dateOfUpcomingDebit: string;
  NISTotalDebit: number;
  USDTotalDebit: number;
  EURTotalDebit: number;
};

export interface CardsPastOrFutureDebitType {
  cardsBlock: CreditCardType[];
  accountCreditFramework: number;
  accountFrameworkNotUsed: number;
  accountFrameworkUsed: number;
}

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

export interface MainLoansType {
  loans: LoanType[];
  summary: {
    currentMonthTotalPayment: number;
    totalBalance: number;
    totalBalanceCurrency: string;
  };
  currentTimestamp: number;
}

export type LoanType = {
  loanAccount: string;
  loanName: string;
  numOfPayments: string;
  numOfPaymentsRemained: string;
  numOfPaymentsMade: string;
  establishmentDate: string;
  establishmentChannelCode: string;
  loanCurrency: string;
  loanAmount: number;
  totalInterestRate: number;
  firstPaymentDate: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  previousPaymentDate: string;
  nextPayment: number;
  previousPayment: number;
  baseInterestDescription: string;
  loanBalance: number;
  prepaymentPenaltyFee: number;
  totalLoanBalance: number;
  finishDate: string;
  loanRefundStatus: string;
  establishmentValueDate: string;
  currentMonthPayment: number;
  numberOfPartialPrepayments: string;
  loanPurpose: string;
};