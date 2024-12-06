import { useTranslation } from "react-i18next";
import { BankAccountModel } from "../../../../models/bank-model";
import { asNumString } from "../../../../utils/helpers";
import { CreditCardType } from "../../../../utils/types";
import { calculateCreditCardsUsage } from "../../../../utils/bank-utils";
import { Divider } from "antd";
import { GoCreditCard } from "react-icons/go";
import "./CreditCardsAndSavings.css";

interface CreditCardsAndSavingsProps {
  currency: string;
  cards: CreditCardType[];
  bankAccount: BankAccountModel;
};

export const CreditCardsAndSavings = (props: CreditCardsAndSavingsProps) => {
  const { t } = useTranslation();
  const totalSaves = props?.bankAccount?.savings?.totalDepositsCurrentValue || 0;
  const used = calculateCreditCardsUsage(props.cards);

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
            {props.currency} {asNumString(used)}
          </div>
        </div>
        <Divider className="custom-divider" />
        <div className="inner-box">
          <div className="inner-box-title-container">
            <div className="inner-box-title-icon">
              <GoCreditCard />
            </div>
            <div className="inner-box-title">{t('dashboard.first.4')}</div>
          </div>
          <div className="inner-box-body">
            {props.currency} {asNumString(totalSaves)}
          </div>
        </div>
      </div>
      <div className="box">
        <div className="inner-box">
          <div className="inner-box-title-container">
            <div className="inner-box-title-icon">
              <GoCreditCard />
            </div>
            <div className="inner-box-title">{t('dashboard.first.5')}</div>
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
            {props.currency} {0}
          </div>
        </div>
      </div>
    </div>
  );
};