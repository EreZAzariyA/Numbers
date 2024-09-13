import { Space } from "antd";
import { TotalAmountInput } from "./TotalAmount";
import TransactionModel from "../../models/transaction";
import { TotalAmountType } from "../../utils/enums";

export const TotalsContainer = (props: { transactions: TransactionModel[] }) => {
  return (
    <Space wrap>
      <TotalAmountInput transactions={props.transactions} type={TotalAmountType.SPENT} style={{ width: 100 }} />
      <TotalAmountInput transactions={props.transactions} type={TotalAmountType.INCOME} style={{ width: 100 }} />
    </Space>
  );
};