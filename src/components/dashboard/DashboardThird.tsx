import { useTranslation } from "react-i18next";
import { CreditCardType } from "../../utils/types";
import { CreditCard } from "../components/CreditCard";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { Card, Empty } from "antd";

interface DashboardThirdProps {
  creditCards: CreditCardType[];
};

const DashboardThird = (props: DashboardThirdProps) => {
  const { t } = useTranslation();
  const isEmpty = !isArrayAndNotEmpty(props.creditCards);

  return (
    <Card
      title={t('dashboard.third.0')}
      className="dashboard-third"
    >
      <div className={`credit-cards ${isEmpty ? 'empty' : ''}`}>
        {!isEmpty ?
          props.creditCards.map((card) => (
            <CreditCard key={card._id} card={card} />
          )) :
          <Empty />
        }
      </div>
    </Card>
  );
};

export default DashboardThird;