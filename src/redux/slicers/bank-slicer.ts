import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BanksAccount } from "../../models/bank-model";
import bankServices from "../../services/banks";

interface BanksAccountState {
  account: BanksAccount | null;
  loading: boolean;
  error: string | null;
};

const initialState: BanksAccountState = {
  account: {
    banks: [],
    userId: null
  },
  loading: false,
  error: null
};

export const fetchBankAccounts = createAsyncThunk(
  'banks/fetchBankAccounts',
  async (userId: string) => {
  const banks = await bankServices.fetchBankAccounts(userId);
  return banks;
});

const bankSlicer = createSlice({
  initialState,
  name: 'banks',
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBankAccounts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(fetchBankAccounts.fulfilled, (state, action) => {
      state.loading = false;
      state.account.banks = action.payload;
    })
    builder.addCase(fetchBankAccounts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error";
    });
  }
});

export default bankSlicer.reducer;