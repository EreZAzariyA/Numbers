import { Dayjs } from "dayjs";
import { SupportedCompaniesTypes } from "../utils/definitions";

class InvoiceModel {
  _id?: string;
  user_id: string;
  date: Dayjs;
  category_id: string;
  description: string;
  amount: number;
  status: string;
  companyId: SupportedCompaniesTypes;

  constructor(invoice: InvoiceModel) {
    this._id = invoice._id;
    this.user_id = invoice.user_id;
    this.date = invoice.date;
    this.category_id = invoice.category_id;
    this.description = invoice.description;
    this.amount = invoice.amount;
    this.status = invoice.status;
    this.companyId = invoice.companyId;
  };
};

export default InvoiceModel;