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