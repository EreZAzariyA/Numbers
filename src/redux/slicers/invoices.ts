import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import InvoiceModel from '../../models/invoice';

export interface InvoicesState {
  invoices: InvoiceModel[]
};

const initialState: InvoiceModel[] = [];

const invoicesSlicer = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    fetchInvoicesAction(state, action: PayloadAction<InvoiceModel[]>) {
      state = action.payload;
      return state;
    },
    addNewInvoiceAction(state, action: PayloadAction<InvoiceModel>) {
      state.push(action.payload);
      return state;
    },
    updateInvoiceAction(state, action: PayloadAction<InvoiceModel>) {
      const invoiceIndex = state.findIndex((i) => i._id === action.payload._id);
      const newState = state;
      newState[invoiceIndex] = action.payload;
      return newState;
    },
    removeInvoiceAction(state, action: PayloadAction<string>) {
      const newState = state.filter((invoice) => invoice._id !== action.payload);
      return newState;
    },
    invoicesOnLogoutAction(state, action: PayloadAction) {
      return initialState;
    }
  }
});

export const { fetchInvoicesAction, addNewInvoiceAction, updateInvoiceAction, removeInvoiceAction, invoicesOnLogoutAction } = invoicesSlicer.actions;
export default invoicesSlicer.reducer