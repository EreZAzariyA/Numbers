import TransactionModel from "../../models/transaction";
import { asNumString, getInvoicesTotalsPrice } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { Input } from "antd";

interface TotalAmountInputProps {
  transactions: TransactionModel[];
  type?: TotalAmountType;
  style?: React.CSSProperties;
};

export const TotalAmountInput = (props: TotalAmountInputProps) => {
  const totalAmount = getInvoicesTotalsPrice(props.transactions);
  const amount = totalAmount[props.type];

  return (
    <Input
      disabled
      value={asNumString(amount)}
      style={{ ...props.style, fontWeight: 600, color: props.type === TotalAmountType.INCOME ? 'green' : 'red' }}
    />
  );
};