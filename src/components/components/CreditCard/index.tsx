import { CreditCardType } from "../../../utils/types";
import { asNumber } from "../../../utils/helpers";
import { Slider, SliderSingleProps } from "antd";
import "./CreditCard.css";

interface CreditCardProps {
  card: CreditCardType;
}

export const CreditCard = (props: CreditCardProps) => {
  const isActive = props.card.cardStatusCode ? props.card.cardStatusCode === 0 : true;
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
              />
            </div>
          )}
      </div>
    </div>
  );
};