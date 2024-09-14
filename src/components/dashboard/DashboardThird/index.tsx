import { useTranslation } from "react-i18next";
import { CreditCardType } from "../../../utils/types";
import { CreditCard } from "../../components/CreditCard";
import "./DashboardThird.css";

interface DashboardThirdProps {
  creditCards: CreditCardType[];
};

const DashboardThird = (props: DashboardThirdProps) => {
  const { t } = useTranslation();

  return (
    <div className="home-third-main-container home-component">
        <div className="card-container">
          <div className="card-title-container">
            <div className="card-title">
              {t('dashboard.third.0')}
            </div>
          </div>
          <div className="card-body">
            <div className="credit-cards">
              {props.creditCards.map((card) => (
                <CreditCard key={card.cardNumber} card={card} />
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardThird;