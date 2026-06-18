import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const PageNotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={t('404.title')}
      subTitle={t('404.subtitle')}
      extra={<Button type="primary" onClick={() => navigate('/')}>{t('404.button')}</Button>}
    />
  );
};

export default PageNotFound;