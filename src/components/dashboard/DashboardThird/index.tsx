import { CreditCardType } from "../../../utils/types";
import { CreditCard } from "../../components/CreditCard";
import "./DashboardThird.css";

interface DashboardThirdProps {
  creditCards: CreditCardType[];
};

const DashboardThird = (props: DashboardThirdProps) => {
  return (
    <div className="home-third-main-container home-component">
        <div className="card-container">
          <div className="card-title-container">
            <div className="card-title">
              Credit cards
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
    </div>
  );
};

export default DashboardThird;