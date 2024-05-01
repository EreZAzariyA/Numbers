import axios from "axios";
import config from "../utils/config";
import store from "../redux/store";
import { addManyInvoices } from "../redux/slicers/invoices";
import { updateUserFields } from "../redux/slicers/auth-slicer";

class BankServices {
  fetchBankData = async (details: any, user_id: string): Promise<any> => {
    const response = await axios.post(config.urls.bank.fetchBankData + `/${user_id}`, details);
    const bankDetails = response.data;
    if (bankDetails) {
      console.log(bankDetails);
      
      store.dispatch(updateUserFields({field: 'bank', value: bankDetails.userBank}))
      return bankDetails;
    }
  };
  
  importTrans = async (transactions: any[], user_id: string): Promise<any> => {
    const response = await axios.post(config.urls.bank.importTransactions + `/${user_id}`, transactions);
    const trans = response.data;
    store.dispatch(addManyInvoices(trans));
    return trans;
  };
};

const bankServices = new BankServices();
export default bankServices;