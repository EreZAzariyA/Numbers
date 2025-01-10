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
};

export default TransactionModel;