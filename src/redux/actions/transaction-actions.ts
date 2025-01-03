import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import TransactionModel from "../../models/transaction";
import config from "../../utils/config";
import { insertBulkTransactionsAction } from "../slicers/transaction-slicer";
import { Transaction } from "../../utils/transactions";
import transactionsServices from "../../services/transactions";

export enum TransactionsActions {
  FETCH_TRANSACTIONS = 'transactions/fetch-transactions',
  ADD_TRANSACTION = 'transactions/add-transaction',
  UPDATE_TRANSACTION = 'transactions/update-transaction',
  REMOVE_TRANSACTION = 'transactions/remove-transaction',
  IMPORT_TRANSACTIONS = 'transactions/import-transactions',
};

export const fetchTransactions = createAsyncThunk<{transactions: TransactionModel[], total: number }, { user_id: string, type?: string, query?: object }>(
  TransactionsActions.FETCH_TRANSACTIONS,
  async ({ user_id, type, query }, thunkApi) => {
    try {
      const { transactions, total } = await transactionsServices.fetchTransactions(
        user_id,
        query,
      );

      return thunkApi.fulfillWithValue({ transactions, total });
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message);
    }
  }
);

export const addTransaction = createAsyncThunk<TransactionModel, { user_id: string, transaction: TransactionModel }>(
  TransactionsActions.ADD_TRANSACTION,
  async ({ user_id, transaction }, thunkApi) => {
    const response = await axios.post<TransactionModel>(config.urls.transactions + `/${user_id}`, transaction);
    const addedTransaction = response.data;
    if (!!addedTransaction) {
      return addedTransaction;
    }
    return thunkApi.rejectWithValue('Some error while trying to add transaction');
  }
);

export const updateTransaction = createAsyncThunk<TransactionModel, { transaction: TransactionModel }>(
  TransactionsActions.UPDATE_TRANSACTION,
  async ({ transaction }, thunkApi) => {
    const response = await axios.put<TransactionModel>(config.urls.transactions, transaction);
    const updatedTransaction = response.data;
    if (!!updatedTransaction) {
      return updatedTransaction;
    }
    return thunkApi.rejectWithValue('Some error while trying to update transaction');
  }
);

export const removeTransaction = createAsyncThunk<void, { user_id: string, transaction_id: string}>(
  TransactionsActions.REMOVE_TRANSACTION,
  async (data) => {
    await axios.delete<void>(config.urls.transactions, { data });
  }
);

export const importTransactions = createAsyncThunk<TransactionModel[], { transactions: Transaction[], user_id: string, companyId: string }>(
  TransactionsActions.IMPORT_TRANSACTIONS,
  async ({ user_id, transactions, companyId }, thunkApi) => {
    try {
      const response = await axios.post<TransactionModel[]>(config.urls.bank.importTransactions + `/${user_id}`, { transactions, companyId });
      const trans = response.data;
      thunkApi.dispatch(insertBulkTransactionsAction(trans));
      return thunkApi.fulfillWithValue(trans);
    } catch (err: any) {
      thunkApi.rejectWithValue(err);
    }
  }
);