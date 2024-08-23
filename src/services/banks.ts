import axios from "axios";
import config from "../utils/config";
import store from "../redux/store";
import { addManyInvoices } from "../redux/slicers/invoices";
import { BankAccountDetails, ScraperCredentials, Transaction } from "../utils/transactions";
import InvoiceModel from "../models/invoice";
import { SupportedCompaniesTypes } from "../utils/definitions";
import { AccountDetails } from "../utils/types";
import { BankAccountModel } from "../models/bank-model";

class BankServices {

  fetchBankAccounts = async (userId: string): Promise<BankAccountModel[]> => {
    const response = await axios.get<BankAccountModel[]>(config.urls.bank.fetchAllBanksAccounts + `/${userId}`);
    const banks = response.data;
    return banks;
  };

  fetchOneBankAccount = async (userId: string, bankName: string): Promise<BankAccountModel> => {
    const response = await axios.get<BankAccountModel>(config.urls.bank.fetchOneBankAccount + `/${userId}`, { data: { bankName } });
    const banks = response.data;
    return banks;
  };

  fetchBankData = async (details: ScraperCredentials, user_id: string): Promise<BankAccountDetails> => {
    const response = await axios.post<BankAccountDetails>(config.urls.bank.fetchBankData + `/${user_id}`, details);
    const data = response.data;
    return data;
  };

  refreshBankData = async (bankName: string, user_id: string): Promise<Pick<AccountDetails, "account">> => {
    const response = await axios.put<AccountDetails>(config.urls.bank.refreshBankData + `/${user_id}`, { bankName });
    const bankData = response.data;
    return bankData;
  };

  updateBankDetails = async (bankName: string, user_id: string, newCredentials: any): Promise<BankAccountDetails> => {
    const response = await axios.put<BankAccountDetails>(config.urls.bank.updateBankDetails + `/${user_id}`, { bankName, newCredentials });
    const data = response.data;
    return data;
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