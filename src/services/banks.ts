import axios from "axios";
import config from "../utils/config";
import store from "../redux/store";
import { addManyInvoices } from "../redux/slicers/invoices";
import { refreshTokenAction } from "../redux/slicers/auth-slicer";
import { AccountDetails, BankAccountDetails, ScraperCredentials, Transaction } from "../utils/transactions";
import InvoiceModel from "../models/invoice";
import { SupportedCompaniesTypes } from "../utils/definitions";

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

  updateBankData = async (bankAccount_id: string, user_id: string): Promise<Pick<AccountDetails, "importedTransactions">> => {
    const response = await axios.put<AccountDetails>(config.urls.bank.updateBankData + `/${user_id}`, { bankAccount_id });
    const { newUserToken, importedTransactions } = response.data;
    if (newUserToken && importedTransactions) {
      store.dispatch(refreshTokenAction(newUserToken));
      return { importedTransactions };
    }
  };
  
  importTrans = async (transactions: Transaction[], user_id: string, companyId: SupportedCompaniesTypes): Promise<InvoiceModel[]> => {
    const response = await axios.post<InvoiceModel[]>(config.urls.bank.importTransactions + `/${user_id}`, { transactions, companyId });
    const trans = response.data;
    store.dispatch(addManyInvoices(trans));
    return trans;
  };
};

const bankServices = new BankServices();
export default bankServices;