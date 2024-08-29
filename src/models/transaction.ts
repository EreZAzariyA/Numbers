import { Dayjs } from "dayjs";
import { SupportedCompaniesTypes } from "../utils/definitions";

class TransactionModel {
  _id: string;
  user_id: string;
  date: Dayjs;
  category_id: string;
  description: string;
  amount: number;
  status: string;
  companyId: SupportedCompaniesTypes;
  identifier?: number | string;

  constructor(transaction: TransactionModel) {
    this._id = transaction._id;
    this.user_id = transaction.user_id;
    this.date = transaction.date;
    this.category_id = transaction.category_id;
    this.description = transaction.description;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.companyId = transaction.companyId;
    this.identifier = transaction.identifier
  };
};

export default TransactionModel;