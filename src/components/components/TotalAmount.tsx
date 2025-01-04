import { asNumString, getInvoicesTotalsPrice } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { MainTransaction } from "../../services/transactions";
import { Input } from "antd";

interface TotalAmountInputProps {
  transactions: MainTransaction[];
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