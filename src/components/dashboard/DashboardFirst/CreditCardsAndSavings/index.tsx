import { asNumString } from "../../../../utils/helpers";
import "./CreditCardsAndSavings.css";
import { AccountSavesType } from "../../../../utils/types";
import { GoCreditCard } from "react-icons/go";
import { Divider } from "antd";
import { useTranslation } from "react-i18next";

interface CreditCardsAndSavingsProps {
  cardsUsed: number;
  savingsBalance: AccountSavesType;
  currency: string
};

export const CreditCardsAndSavings = (props: CreditCardsAndSavingsProps) => {
  const { t } = useTranslation();
  const totalSaves = props.savingsBalance?.totalDepositsCurrentValue || 0;

  return (
    <div className="inner-card-container">
      <div className="box">
        <div className="inner-box">
          <div className="inner-box-title-container">
            <div className="inner-box-title-icon">
              <GoCreditCard />
            </div>
            <div className="inner-box-title">{t('dashboard.first.2')}</div>
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
            <div className="inner-box-title">{t('dashboard.first.3')}</div>
          </div>
          <div className="inner-box-body">
            {props.currency} {asNumString(totalSaves)}
          </div>
        </div>
      </div>
    </div>
  );
};