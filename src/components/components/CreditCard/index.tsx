import { Slider, SliderSingleProps } from "antd";
import { CreditCardType } from "../../../utils/types";
import "./CreditCard.css";
import { asNumber } from "../../../utils/helpers";

interface CreditCardProps {
  card: CreditCardType;
}

export const CreditCard = (props: CreditCardProps) => {

  const isActive = props.card.cardStatusCode === 0;
  const cardFramework = props.card.cardFramework;
  const cardFrameworkUsed = props.card.cardFrameworkUsed;
  const percentage = asNumber((cardFrameworkUsed / cardFramework) * 100);

  const marks: SliderSingleProps['marks'] = {
    [cardFramework]: {
      style: {
        color: '#f50',
      },
      label: <strong>{cardFramework}</strong>,
    },
  };
  const trackStyle = {
    background: `green`,
  };

  return (
    <div className="credit-card-main-container">
      <div className={`credit-card ${!isActive ? 'non-active' : ''}`}>
        <div className="card-number">
          {props.card.cardNumber}
        </div>
        <div className="card-percentage">
          {percentage}%
        </div>

          {isActive && (
            <div className="slider">
              <Slider
                disabled
                marks={marks}
                styles={{ track: trackStyle }}
                defaultValue={cardFrameworkUsed}
                min={0}
                max={cardFramework}
                tooltip={{ open: true, arrow: true }}
              />
            </div>
          )}
      </div>
    </div>
  );
};