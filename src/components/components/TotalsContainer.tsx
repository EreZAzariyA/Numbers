import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/store";
import transactionsServices from "../../services/transactions";
import TransactionModel from "../../models/transaction";
import { TotalAmountInput } from "./TotalAmount";
import { TotalAmountType } from "../../utils/enums";
import { message, Space } from "antd";
import { queryFiltering } from "../../utils/helpers";
import { TransactionsType, TransType } from "../../utils/transactions";

export const TotalsContainer = (props: { filterState: {}, query?: {}, type?: TransType }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const isCardTransactions = props?.type === TransactionsType.CARD_TRANSACTIONS;

  useEffect(() => {
    const dispatchTransactions = async () => {
      const query = props.query || queryFiltering(props.filterState);

      try {
        const { transactions } = await transactionsServices.fetchTransactions(user._id, query, props.type);
        setTransactions(transactions);
      } catch (err: any) {
        message.error(err);
      }
    };

    dispatchTransactions();
  }, [props.filterState, props.query, props.type, user._id]);

  return (
    <Space>
      <TotalAmountInput transactions={transactions} type={TotalAmountType.SPENT} style={{ width: 100 }} />
      {!isCardTransactions && (
        <TotalAmountInput transactions={transactions} type={TotalAmountType.INCOME} style={{ width: 100 }} />
      )}
    </Space>
  );
};