import { asNumString } from "../../../../utils/helpers";
import "./CreditCardsAndSavings.css";
import { AccountSavesType } from "../../../../utils/types";
import { GoCreditCard } from "react-icons/go";
import { Divider } from "antd";

interface CreditCardsAndSavingsProps {
  cardsUsed: number;
  savingsBalance: AccountSavesType;
  currency: string
};

export const CreditCardsAndSavings = (props: CreditCardsAndSavingsProps) => {
  const totalSaves = props.savingsBalance?.totalDepositsCurrentValue || 0;

  return (
    <div className="inner-card-container">
      <div className="box">
        <div className="inner-box">
          <div className="inner-box-title-container">
            <div className="inner-box-title-icon">
              <GoCreditCard />
            </div>
            <div className="inner-box-title">Credit cards</div>
          </div>
          <div className="inner-box-body">
            {props.currency} {asNumString(props.cardsUsed || 0)}
          </div>
        </div>
        <Divider className="custom-divider" />
        <div className="inner-box">
          <div className="inner-box-title-container">
            <div className="inner-box-title-icon">
              <GoCreditCard />
            </div>
            <div className="inner-box-title">Deposits and savings</div>
          </div>
          <div className="inner-box-body">
            {props.currency} {asNumString(totalSaves)}
          </div>
        </div>
      </div>
    </div>
  );
};