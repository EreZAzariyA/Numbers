import { MenuProps } from "antd";
import { TransactionsTypes } from "./enums";

export type ATMTransactionsTypes = [TransactionsTypes.ATM, TransactionsTypes.ATM_WITHDRAWAL, TransactionsTypes.FROM_ATM];
export type SalaryTypes = [TransactionsTypes.SALARY];
export type CardWithdrawalTypes = [TransactionsTypes.TRANSFER_FROM, TransactionsTypes.TRANSFER_TO];
export type AllCardTransactionsTypes = [TransactionsTypes.CARD_WITHDRAWALS, ...CardWithdrawalTypes];

export const ATMWithdrawalsList: ATMTransactionsTypes = [
  TransactionsTypes.ATM,
  TransactionsTypes.ATM_WITHDRAWAL,
  TransactionsTypes.FROM_ATM
];
export const CardWithdrawalsList: AllCardTransactionsTypes = [
  TransactionsTypes.CARD_WITHDRAWALS,
  TransactionsTypes.TRANSFER_FROM,
  TransactionsTypes.TRANSFER_TO,
];

export const WithdrawalsListTypes: any = {
  [TransactionsTypes.ATM]:  ATMWithdrawalsList,
  [TransactionsTypes.CARD_WITHDRAWALS]: CardWithdrawalsList
};


export type MenuItem = Required<MenuProps>['items'][number];
export const getMenuItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  value?: string
): MenuItem  => {
  return {
    key,
    icon,
    children,
    label,
    type,
    value
  } as MenuItem;
};

export interface DataType {
  _id: string;
  name: string;
  editable: boolean;
};

export interface InvoiceDataType {
  _id: string;
  date: Date;
  category: string;
  description: string
  amount: number;
  editable: boolean;
};