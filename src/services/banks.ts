import axios from "axios";
import config from "../utils/config";
import store from "../redux/store";
import { addManyInvoices } from "../redux/slicers/invoices";
import { refreshTokenAction, updateUserFieldsAction } from "../redux/slicers/auth-slicer";

class BankServices {
  fetchBankData = async (details: any, user_id: string): Promise<any> => {
    const response = await axios.post(config.urls.bank.fetchBankData + `/${user_id}`, details);
    const data = response.data;
    if (data && data.token) {
      store.dispatch(refreshTokenAction(data.token));
      return data;
    }
  };

  updateBankData = async (token: any, user_id: string): Promise<any> => {
    const response = await axios.post(config.urls.bank.updateBankData + `/${user_id}`, token);
    const bankDetails = response.data;
    if (bankDetails) {
      store.dispatch(updateUserFieldsAction({field: 'bank', value: bankDetails.userBank}))
      return bankDetails;
    }
  };
  
  importTrans = async (transactions: any[], user_id: string): Promise<any> => {
    const response = await axios.post(config.urls.bank.importTransactions + `/${user_id}`, transactions);
    const trans = response.data;
    store.dispatch(addManyInvoices(trans));
    return trans;
  };

  fetchBankHtml = async (url: string) => {
    const response = await axios.post(config.urls.bank.fetchBankHtml, {url});
    const html = response.data;
    return html;
  }
};

const bankServices = new BankServices();
export default bankServices;