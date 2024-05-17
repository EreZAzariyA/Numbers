import { Input } from "antd";
import { asNumString, getInvoicesTotalsPrice } from "../../utils/helpers";
import InvoiceModel from "../../models/invoice";
import { TotalAmountType } from "../../utils/enums";
import React from "react";

interface TotalAmountInputProps {
  invoices: InvoiceModel[];
  type?: TotalAmountType;
  style?: React.CSSProperties;
};

const TotalAmountInput = (props: TotalAmountInputProps) => {
  const totalAmount = getInvoicesTotalsPrice(props.invoices);
  const amount = totalAmount[props.type];

  return (
    <Input
      disabled
      value={asNumString(amount)}
      style={{...props.style, fontWeight: 600, color: props.type === TotalAmountType.INCOME ? 'green' : 'red' }}
    />
  );
};

export default TotalAmountInput