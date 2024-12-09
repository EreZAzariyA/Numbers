import axios from "axios";
import config from "../utils/config";
import { RefreshedBankAccountDetails } from "../utils/transactions";
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

  updateBankDetails = async (bank_id: string, user_id: string, newCredentials: any): Promise<RefreshedBankAccountDetails> => {
    const response = await axios.put<RefreshedBankAccountDetails>(config.urls.bank.updateBankDetails + `/${user_id}`, { bank_id, newCredentials });
    const data = response.data;
    return data;
  };
};

const bankServices = new BankServices();
export default bankServices;