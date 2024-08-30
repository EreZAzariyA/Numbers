import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import TransactionModel from "../../models/transaction";
import config from "../../utils/config";

export enum TransactionsActions {
  FETCH_TRANSACTIONS = 'transactions/fetchTransactions',
  ADD_TRANSACTION = 'transactions/addTransaction',
  UPDATE_TRANSACTION = 'transactions/updateTransaction',
  REMOVE_TRANSACTION = 'transactions/removeTransaction',
};

export const fetchTransactions = createAsyncThunk<TransactionModel[], string>(
  TransactionsActions.FETCH_TRANSACTIONS,
  async (user_id) => {
    const response = await axios.get<TransactionModel[]>(config.urls.transactions + `/${user_id}`);
    const userTransactions = response.data;
    return userTransactions || [];
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