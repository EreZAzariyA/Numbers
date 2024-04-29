import { Input } from "antd";
import { asNumber, getInvoicesTotalsPrice } from "../../utils/helpers";
import InvoiceModel from "../../models/invoice";

interface TotalAmountInputProps {
  invoices: InvoiceModel[];
}

const TotalAmountInput = (props: TotalAmountInputProps) => {

  const totalAmount = getInvoicesTotalsPrice(props.invoices);
  return (
    <Input style={{maxWidth: '350px'}} disabled value={asNumber(totalAmount.spent)} />
  )
};

export default TotalAmountInput