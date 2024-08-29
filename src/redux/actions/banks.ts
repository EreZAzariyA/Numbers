import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MainBanksAccount } from "../../models/bank-model";
import { insertBulkTransactionsAction } from "../slicers/transactions";
import config from "../../utils/config";
import { RefreshedBankAccountDetails } from "../../utils/transactions";
import { isArrayAndNotEmpty } from "../../utils/helpers";

export const fetchBankAccounts = createAsyncThunk(
  'banks/fetchBankAccounts',
  async (userId: string) => {
    const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${userId}`);
    const mainBanksAccount = response.data;
    return mainBanksAccount;
  }
);

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