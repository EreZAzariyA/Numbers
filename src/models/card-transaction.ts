import { TransactionStatuses } from "../utils/transactions";

class CardTransactionModel {
  user_id: string;
  cardNumber: string | number;
  date: string;
  identifier: number | string;
  category_id: string;
  description: string;
  amount: number;
  status?: TransactionStatuses;
  companyId?: string;
};

export default CardTransactionModel;