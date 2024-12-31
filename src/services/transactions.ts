import axios from "axios";
import TransactionModel from "../models/transaction";
import config from "../utils/config";
import { TransType } from "../utils/transactions";

class TransactionsServices {
  fetchTransactions = async (user_id: string, query?: object, type?: TransType) => {
    const response = await axios.get<{transactions: TransactionModel[], total: number }>(
      config.urls.transactions + user_id,
      { params: { query, type } }
    );

    const { transactions, total } = response.data;
    return { transactions, total };
  }

}

const transactionsServices = new TransactionsServices();
export default transactionsServices;