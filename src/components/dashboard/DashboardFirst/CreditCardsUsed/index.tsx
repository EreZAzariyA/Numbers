import { CreditCardType } from "../../../../utils/types";
import { getCreditCardsFramework } from "../../../../utils/bank-utils";
import { Slider, SliderSingleProps } from "antd";
import { FrownOutlined } from '@ant-design/icons';
import "./CreditCardsUsed.css";
import { asNumber } from "../../../../utils/helpers";

export const CreditCardsUsed = (props: {creditCards: CreditCardType[]}) => {

  const cardsUsed = getCreditCardsFramework(props.creditCards);

  return (
    <div className="sliders-container">
      {Object.entries(cardsUsed).map(([cardNumber, { cardFramework, cardFrameworkUsed }]) => {

        const percentage = asNumber((cardFrameworkUsed / cardFramework) * 100);

        const marks: SliderSingleProps['marks'] = {
          0: '0',
          [cardFramework]: {
            style: {
              color: '#f50',
            },
            label: <strong>{cardFramework}</strong>,
          },
        };
        const trackStyle = {
          background: `linear-gradient(to right, #4caf50 100%, #ccc ${percentage}%)`,
        };

        return (
          <>
            <p>{cardNumber}</p>
            <div className="icon-wrapper">
              <Slider
                disabled
                marks={marks}
                styles={{ track: trackStyle }}
                defaultValue={cardFrameworkUsed}
                min={0}
                max={cardFramework}
                tooltip={{ open: true }}
              />
              <FrownOutlined style={{ color: `rgb(${percentage * 3} 0 0)` }} />
            </div>
          </>
        )
      })}
    </div>
  )
}