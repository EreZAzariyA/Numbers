import axios from "axios";
import InvoiceModel from "../models/invoice";
import config from "../utils/config";
import store from "../redux/store";
import { addNewInvoiceAction, fetchInvoicesAction, removeInvoiceAction, updateInvoiceAction } from "../redux/slicers/invoices";

class InvoicesServices {
  async fetchInvoicesByUserId(user_id: string): Promise<InvoiceModel[]> {
    const response = await axios.get<InvoiceModel[]>(config.urls.invoices + `/${user_id}`);
    const userInvoices = response.data;
    store.dispatch(fetchInvoicesAction(userInvoices));
    return userInvoices;
  };

  async addInvoice(invoice: InvoiceModel): Promise<InvoiceModel> {
    const response = await axios.post<InvoiceModel>(config.urls.invoices, invoice);
    const addedInvoice = response.data;
    store.dispatch(addNewInvoiceAction(addedInvoice));
    return addedInvoice;
  };

  async updateInvoice(invoice: InvoiceModel): Promise<InvoiceModel> {
    const response = await axios.put<InvoiceModel>(config.urls.invoices, invoice);
    const updatedInvoice = response.data;
    store.dispatch(updateInvoiceAction(updatedInvoice));
    return updatedInvoice;
  }

  async removeInvoice(invoice_id: string): Promise<void> {
    await axios.delete<void>(config.urls.invoices + `/${invoice_id}`);
    store.dispatch(removeInvoiceAction(invoice_id));
  }
};

const invoicesServices = new InvoicesServices();
export default invoicesServices;