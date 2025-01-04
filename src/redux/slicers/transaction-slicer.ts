import { ActionReducerMapBuilder, createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import TransactionModel from "../../models/transaction";
import { addTransaction, importTransactions, removeTransaction, updateTransaction } from "../actions/transaction-actions";

type InitialStateType = {
  transactions: TransactionModel[];
  loading: boolean;
  error: SerializedError | null;
};

const initialState: InitialStateType = {
  transactions: [],
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<InitialStateType>) => {
  // Add transaction:
  builder.addCase(addTransaction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(addTransaction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(addTransaction.fulfilled, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    transactions: [...state.transactions, action.payload]
  }));

  // Update transaction:
  builder.addCase(updateTransaction.pending, (state) => ({
    ...state,
    loading: true,
  }))
  .addCase(updateTransaction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  }))
  .addCase(updateTransaction.fulfilled, (state, action) => {
    state.error = null;
    state.loading = false;
    const index = state.transactions.findIndex((i) => i._id === action.payload._id);
    state.transactions[index] = action.payload;
  });

  // Remove transaction:
  builder.addCase(removeTransaction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(removeTransaction.rejected, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  }))
  .addCase(removeTransaction.fulfilled, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    transactions: state.transactions.filter((i) => i._id !== action.meta.arg.transaction_id)
  }));

  builder.addCase(importTransactions.pending, (state) => ({
    ...state,
    loading: true
  }))
  builder.addCase(importTransactions.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  builder.addCase(importTransactions.fulfilled, (state) => ({
    ...state,
    loading: false,
  }));
};

const transactionsSlicer = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    insertBulkTransactionsAction(state, action: PayloadAction<TransactionModel[]>) {
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload]
      };
    },
    transactionsHandleLogout() {
      return {
        transactions: [],
        error: null,
        loading: false
      }
    }
  },
  extraReducers
});

export const {
  insertBulkTransactionsAction,
  transactionsHandleLogout,
} = transactionsSlicer.actions;

export default transactionsSlicer.reducer;