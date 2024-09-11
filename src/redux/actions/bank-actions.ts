import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BankAccountDetails, MainBanksAccount } from "../../models/bank-model";
import { insertBulkTransactionsAction } from "../slicers/transaction-slicer";
import config from "../../utils/config";
import { RefreshedBankAccountDetails, ScraperCredentials } from "../../utils/transactions";
import { isArrayAndNotEmpty } from "../../utils/helpers";

export enum BanksActions {
  CONNECT_BANK = "banks/connectBank",
  FETCH_BANK_ACCOUNT = "banks/fetchBankAccount",
  REFRESH_BANK_ACCOUNT = "banks/refreshBankData",
};

export const fetchBankAccounts = createAsyncThunk<MainBanksAccount, string>(
  BanksActions.FETCH_BANK_ACCOUNT,
  async (user_id) => {
    const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${user_id}`);
    const mainBanksAccount = response.data;
    return mainBanksAccount;
  }
);

export const connectBankAccount = createAsyncThunk<BankAccountDetails, { details: ScraperCredentials, user_id: string } >(
  BanksActions.CONNECT_BANK,
  async ({ details, user_id }) => {
    const response = await axios.post<BankAccountDetails>(config.urls.bank.connectBank + `/${user_id}`, details);
    const data = response.data;
    return data;
  }
)

export const refreshBankData = createAsyncThunk<RefreshedBankAccountDetails, { bank_id: string, user_id: string }>(
  BanksActions.REFRESH_BANK_ACCOUNT,
  async ({ bank_id, user_id }, thunkApi) => {
    try {
      const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.refreshBankData + `/${user_id}`, { bank_id });
      const data = response.data;
      if (isArrayAndNotEmpty(data.importedTransactions)) {
        thunkApi.dispatch(insertBulkTransactionsAction(data.importedTransactions));
      }
      return thunkApi.fulfillWithValue(data);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);