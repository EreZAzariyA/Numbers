import axios from "axios";
import config from "../utils/config";
import store from "../redux/store";
import { addManyInvoices } from "../redux/slicers/invoices";
import { refreshTokenAction, updateUserFieldsAction } from "../redux/slicers/auth-slicer";
import { BankAccountDetails, ScraperCredentials, Transaction } from "../utils/transactions";
import InvoiceModel from "../models/invoice";

class BankServices {
  fetchBankData = async (details: ScraperCredentials, user_id: string): Promise<BankAccountDetails> => {
    const response = await axios.post<BankAccountDetails>(config.urls.bank.fetchBankData + `/${user_id}`, details);
    const data = response.data;

    if (data && data.newUserToken) {
      store.dispatch(refreshTokenAction(data.newUserToken));
      return data;
    }

    throw new Error('Some error while trying to fetch bank account data');
  };

  updateBankData = async (bankAccount_id: string, user_id: string): Promise<BankAccountDetails> => {
    const response = await axios.put<BankAccountDetails>(config.urls.bank.updateBankData + `/${user_id}`, bankAccount_id);
    const bankDetails = response.data;
    if (bankDetails) {
      store.dispatch(updateUserFieldsAction({ field: 'bank', value: bankDetails.userBank }));
      return bankDetails;
    }

    throw new Error('Some error while trying to update bank data');
  };
  
  importTrans = async (transactions: Transaction[], user_id: string): Promise<InvoiceModel[]> => {
    const response = await axios.post<InvoiceModel[]>(config.urls.bank.importTransactions + `/${user_id}`, transactions);
    const trans = response.data;
    store.dispatch(addManyInvoices(trans));
    return trans;
  };
};

const bankServices = new BankServices();
export default bankServices;