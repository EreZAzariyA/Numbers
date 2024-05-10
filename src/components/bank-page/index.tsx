import { useSelector } from "react-redux";
import ConnectBankForm from "./ConnectBankForm";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import BankAccountPage from "./BankAccountPage";

const BankPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const bankAccount = user.bank;
  const hasBankAccount = bankAccount ? true : false;

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
          <BankAccountPage bankAccount={bankAccount}/>
        )}
      </div>
    </div>
  );
};

export default BankPage;