import { Button, Flex, Result, Typography } from "antd";
import { useTranslation } from "react-i18next";

const CreditCards = () => {
  const { t } = useTranslation();

  return (
    <Flex vertical className="page-container credit-cards">
      <Typography.Title level={2} className="page-title">{t('pages.creditCards')}</Typography.Title>
      <div className="page-inner-container">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back Home</Button>}
      />
      </div>

    </Flex>
  );
};

export default CreditCards;