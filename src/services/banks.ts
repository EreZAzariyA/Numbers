import axios from "axios";
import config from "../utils/config";
import { RefreshedBankAccountDetails, Transaction } from "../utils/transactions";
import TransactionModel from "../models/transaction";
import { SupportedCompaniesTypes } from "../utils/definitions";
import { BankAccountModel, MainBanksAccount } from "../models/bank-model";

class BankServices {

  fetchBankAccounts = async (userId: string): Promise<MainBanksAccount> => {
    const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${userId}`);
    const banks = response.data;
    return banks;
  };

  fetchOneBankAccount = async (userId: string, bankName: string): Promise<BankAccountModel> => {
    const response = await axios.get<BankAccountModel>(config.urls.bank.fetchOneBankAccount + `/${userId}`, { data: { bankName } });
    const banks = response.data;
    return banks;
  };

  // fetchBankData = async (details: ScraperCredentials, user_id: string): Promise<RefreshedBankAccountDetails> => {
  //   const response = await axios.post<RefreshedBankAccountDetails>(config.urls.bank.fetchBankData + `/${user_id}`, details);
  //   const data = response.data;
  //   return data;
  // };

  updateBankDetails = async (bankName: string, user_id: string, newCredentials: any): Promise<RefreshedBankAccountDetails> => {
    const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.updateBankDetails + `/${user_id}`, { bankName, newCredentials });
    const data = response.data;
    return data;
  };

  importTrans = async (transactions: Transaction[], user_id: string, companyId: SupportedCompaniesTypes): Promise<TransactionModel[]> => {
    const response = await axios.post<TransactionModel[]>(config.urls.bank.importTransactions + `/${user_id}`, { transactions, companyId });
    const trans = response.data;
    // store.dispatch(addManyInvoices(trans));
    return trans;
  };
};

const bankServices = new BankServices();
export default bankServices;