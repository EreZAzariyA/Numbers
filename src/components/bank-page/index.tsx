import { useSelector } from "react-redux";
import ConnectBankForm from "./ConnectBankForm";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { Tabs, TabsProps, Typography } from "antd";
import BankAccountPage from "./BankAccountPage";

const BankPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const bankDetails = user.bank;
  const hasBankAccount = bankDetails && Array.isArray(bankDetails) && bankDetails?.length > 0;

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [...bankDetails].map((bankAccount) => ({
    key: bankAccount.bankName,
    label: <Typography.Text>{bankAccount.bankName}</Typography.Text>,
    children: <BankAccountPage bankAccount={bankAccount} />
  }));

  return (
    <div className="page-container bank-account">
      <div className="title-container">
        <div className="page-title">{t('pages.bankAccount')}</div>
      </div>
      <div className="page-inner-container">
        {!hasBankAccount && (
          <ConnectBankForm user={user} />
        )}
        {hasBankAccount && (
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            type="card"
          />
        )}
      </div>
    </div>
  );
};

export default BankPage;