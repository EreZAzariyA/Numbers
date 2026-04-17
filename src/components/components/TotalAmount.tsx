import { useTranslation } from "react-i18next";
import { asNumString, getInvoicesTotalsPrice } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { MainTransaction } from "../../services/transactions";

interface TotalAmountInputProps {
  transactions: MainTransaction[];
  type?: TotalAmountType;
  style?: React.CSSProperties;
  label?: string;
};

export const TotalAmountInput = (props: TotalAmountInputProps) => {
  const { t } = useTranslation();
  const totalAmount = getInvoicesTotalsPrice(props.transactions);
  const amount = totalAmount[props.type];
  const isIncome = props.type === TotalAmountType.INCOME;

  return (
    <div className={`total-amount-stat ${isIncome ? 'income' : 'spent'}`} style={props.style}>
      <span className="total-amount-label">{props.label ?? (isIncome ? t('totals.income') : t('totals.spent'))}</span>
      <span className="total-amount-value">{asNumString(amount)}</span>
    </div>
  );
};