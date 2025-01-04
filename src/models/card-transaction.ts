import { TransactionsTableTypes } from "../utils/helpers";
import { TransactionInstallments, TransactionStatuses } from "../utils/transactions";

class CardTransactionModel {
  _id: string;
  user_id: string;
  cardNumber: string | number;
  date: string;
  identifier: number | string;
  category_id: string;
  description: string;
  amount: number;
  companyId?: string;
  momo?: string;
  status: TransactionStatuses;
  category?: string;
  categoryDescription?: string;
  channel?: string;
  channelName?: string;
  chargedAmount: number;
  chargedCurrency?: string;
  installments?: TransactionInstallments;
  memo?: string;
  originalAmount: number;
  originalCurrency: string;
  processedDate: string;
  type: TransactionsTableTypes;
};

export default CardTransactionModel;