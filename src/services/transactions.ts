import axios from "axios";
import TransactionModel from "../models/transaction";
import config from "../utils/config";

class TransactionsServices {
  fetchTransactions = async (user_id: string, type?: string, query?: object) => {
    const response = await axios.get<{transactions: TransactionModel[], total: number }>(
      config.urls.transactions + user_id,
      { params: { type, query } }
    );

    const { transactions, total } = response.data;
    return { transactions, total };
  }

}

const transactionsServices = new TransactionsServices();
export default transactionsServices;