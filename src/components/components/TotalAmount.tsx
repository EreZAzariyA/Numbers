import { Input } from "antd";
import { getInvoicesTotalsPrice } from "../../utils/helpers";
import InvoiceModel from "../../models/invoice";

interface TotalAmountInputProps {
  invoices: InvoiceModel[];
}

const TotalAmountInput = (props: TotalAmountInputProps) => {

  const totalAmount = getInvoicesTotalsPrice(props.invoices);
  return (
    <Input style={{maxWidth: '350px'}} disabled value={totalAmount.toFixed(2)} />
  )
};

export default TotalAmountInput