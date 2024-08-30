import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BankAccountDetails, MainBanksAccount } from "../../models/bank-model";
import { insertBulkTransactionsAction } from "../slicers/transactions";
import config from "../../utils/config";
import { RefreshedBankAccountDetails, ScraperCredentials } from "../../utils/transactions";
import { isArrayAndNotEmpty } from "../../utils/helpers";

export enum BanksActions {
  CONNECT_BANK = "banks/connectBank",
  FETCH_BANK_ACCOUNT = "banks/fetchBankAccount",
  REFRESH_BANK_ACCOUNT = "banks/refreshBankData",
};

export const fetchBankAccounts = createAsyncThunk(
  BanksActions.FETCH_BANK_ACCOUNT,
  async (userId: string) => {
    const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${userId}`);
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

export const refreshBankData = createAsyncThunk(
  'banks/refreshBankData',
  async (props: { bank_id: string, user_id: string }, api): Promise<RefreshedBankAccountDetails> => {
    const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.refreshBankData + `/${props.user_id}`, { bank_id: props.bank_id });
    const data = response.data;
    if (isArrayAndNotEmpty(data.importedTransactions)) {
      api.dispatch(insertBulkTransactionsAction(data.importedTransactions));
    }
    return data;
  }
);