import { Input } from "antd";
import { asNumString, getInvoicesTotalsPrice } from "../../utils/helpers";
import InvoiceModel from "../../models/invoice";
import { TotalAmountType } from "../../utils/enums";

interface TotalAmountInputProps {
  invoices: InvoiceModel[];
  type?: TotalAmountType;
};

const TotalAmountInput = (props: TotalAmountInputProps) => {
  const totalAmount = getInvoicesTotalsPrice(props.invoices);

  return (
    <>
      {props.type === TotalAmountType.INCOME && (
        <Input disabled style={{ width: '150px', fontWeight: 600, color: 'green' }} value={asNumString(totalAmount.income)} />
      )}
      {props.type === TotalAmountType.SPENT && (
        <Input disabled style={{ width: '150px', fontWeight: 600, color: 'red' }} value={asNumString(totalAmount.spent)} />
      )}
    </>
  );
};

export default TotalAmountInput