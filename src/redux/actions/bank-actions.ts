import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MainBanksAccount } from "../../models/bank-model";
import config from "../../utils/config";
import { RefreshedBankAccountDetails, ScraperCredentials } from "../../utils/transactions";

export enum BanksActions {
  CONNECT_BANK = "banks/connectBank",
  FETCH_BANK_ACCOUNT = "banks/fetchBankAccount",
  REFRESH_BANK_ACCOUNT = "banks/refreshBankData",
  SET_AS_MAIN_ACCOUNT = "banks/setAsMainAccount",
  REMOVE_BANK_ACCOUNT = "banks/removeBankAccount",
};

export const fetchBankAccounts = createAsyncThunk<MainBanksAccount, string>(
  BanksActions.FETCH_BANK_ACCOUNT,
  async (user_id, thunkApi) => {
    try {
      const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${user_id}`);
      const mainBanksAccount = response.data;
      return mainBanksAccount;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const connectBankAccount = createAsyncThunk<RefreshedBankAccountDetails, { details: ScraperCredentials, user_id: string }>(
  BanksActions.CONNECT_BANK,
  async ({ details, user_id }, thunkApi) => {
    try {
      const response = await axios.post<RefreshedBankAccountDetails>(config.urls.bank.connectBank + `/${user_id}`, details);
      const data = response.data;
      return thunkApi.fulfillWithValue(data);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || error);
    }
  }
);

export const refreshBankData = createAsyncThunk<RefreshedBankAccountDetails, { bank_id: string, user_id: string }>(
  BanksActions.REFRESH_BANK_ACCOUNT,
  async ({ bank_id, user_id }, thunkApi) => {
    try {
      const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.refreshBankData + `/${user_id}`, { bank_id });
      const data = response.data;
      return thunkApi.fulfillWithValue(data);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const setBankAsMainAccount = createAsyncThunk<void, { user_id: string, bank_id: string }>(
  BanksActions.SET_AS_MAIN_ACCOUNT,
  async ({ user_id, bank_id }, thunkApi) => {
    try {
      await axios.post<void>(config.urls.bank.setMainAccount + `/${user_id}`, { bank_id });
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeBankAccount = createAsyncThunk<void, { user_id: string, bank_id: string }>(
  BanksActions.REMOVE_BANK_ACCOUNT,
  async ({ user_id, bank_id }, thunkApi) => {
    try {
      await axios.delete<void>(config.urls.bank.removeBankAccount + `/${user_id}`, { data: { bank_id } });
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);