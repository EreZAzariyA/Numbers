import { CreditCardType } from "../../../utils/types";
import "./CreditCard.css";

interface CreditCardProps {
  card: CreditCardType;
}

export const CreditCard = (props: CreditCardProps) => {
  return (
    <div className="credit-card-main-container">
      <div className="credit-card">
        {props.card.cardNumber}
      </div>
    </div>
  );
};