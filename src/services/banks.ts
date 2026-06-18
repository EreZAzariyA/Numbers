import axios from "axios";
import config from "../utils/config";
import { RefreshedBankAccountDetails, ScraperCredentials, ScrapingJobResponse } from "../utils/transactions";
import { BankAccountModel, MainBanksAccount } from "../models/bank-model";

class BankServices {

  fetchBankAccounts = async (userId: string): Promise<MainBanksAccount> => {
    const response = await axios.get<MainBanksAccount>(config.urls.bank.fetchAllBanksAccounts + `/${userId}`);
    const banks = response.data;
    return banks;
  };

  fetchOneBankAccount = async (userId: string, bankId: string): Promise<BankAccountModel> => {
    const response = await axios.get<BankAccountModel>(config.urls.bank.fetchOneBankAccount + `/${userId}/${bankId}`);
    const banks = response.data;
    return banks;
  };

  updateBankDetails = async (bank_id: string, user_id: string, newCredentials: any): Promise<RefreshedBankAccountDetails> => {
    const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.updateBankDetails + `/${user_id}`, { bank_id, newCredentials });
    const data = response.data;
    return data;
  };

  connectBank = async (user_id: string, details: ScraperCredentials): Promise<ScrapingJobResponse> => {
    const response = await axios.post<ScrapingJobResponse>(config.urls.bank.connectBank + `/${user_id}`, details);
    return response.data;
  };

  refreshBankData = async (user_id: string, bank_id: string): Promise<ScrapingJobResponse> => {
    const response = await axios.put<ScrapingJobResponse>(config.urls.bank.refreshBankData + `/${user_id}`, { bank_id });
    return response.data;
  };

  setMainAccount = async (user_id: string, bank_id: string): Promise<void> => {
    await axios.post<void>(config.urls.bank.setMainAccount + `/${user_id}`, { bank_id });
  };

  removeBankAccount = async (user_id: string, bank_id: string): Promise<void> => {
    await axios.delete<void>(config.urls.bank.removeBankAccount + `/${user_id}`, { data: { bank_id } });
  };
};

const bankServices = new BankServices();
export default bankServices;
