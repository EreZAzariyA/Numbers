import { SupportedCompaniesTypes } from "./definitions";

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
}