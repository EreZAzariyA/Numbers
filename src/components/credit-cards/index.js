import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";


const CreditCards = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container credit-cards">
      <div className="title-container">
        <div className="page-title">{t('pages.creditCards')}</div>
      </div>
      <div className="page-inner-container">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back Home</Button>}
      />
      </div>

    </div>
  );
};

export default CreditCards;