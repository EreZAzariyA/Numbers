import { useTranslation } from "react-i18next";
import { CreditCardType } from "../../../utils/types";
import { asNumber } from "../../../utils/helpers";
import "./CreditCard.css";

interface CreditCardProps {
  card: CreditCardType;
}

export const CreditCard = (props: CreditCardProps) => {
  const { t } = useTranslation();
  const isActive = props.card.cardStatusCode ? props.card.cardStatusCode === 0 : true;
  const cardFramework = props.card.cardFramework;
  const cardFrameworkUsed = props.card.cardFrameworkUsed;
  const percentage = asNumber((cardFrameworkUsed / cardFramework) * 100);

  return (
    <div className="credit-card-main-container">
      <div className={`credit-card ${!isActive ? 'non-active' : ''}`}>
        <div className="card-top-row">
          <div className="card-chip">
            <div className="chip-line chip-line-h" />
            <div className="chip-line chip-line-v" />
          </div>
          <span className="card-family">{props.card.cardFamilyDescription}</span>
        </div>

        <div className="card-number">
          •••• •••• •••• {props.card.cardNumber}
        </div>

        <div className="card-bottom-row">
          <div className="card-holder-info">
            <span className="card-label">{t('creditCard.cardHolder')}</span>
            <span className="card-holder-name">
              {props.card.cardHolderFirstName} {props.card.cardHolderLastName}
            </span>
          </div>
          {props.card.cardValidityDate && (
            <div className="card-expiry-info">
              <span className="card-label">{t('creditCard.expires')}</span>
              <span className="card-expiry">{props.card.cardValidityDate}</span>
            </div>
          )}
        </div>

        {isActive && (
          <div className="card-usage-row">
            <div className="card-usage-track">
              <div
                className="card-usage-fill"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="card-usage-pct">{percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
