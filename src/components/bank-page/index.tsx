import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import BankAccountPage from "./BankAccountPage";
import ConnectBankForm from "./ConnectBankForm";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { CompaniesNames } from "../../utils/definitions";
import { Modal, Result, Tabs, TabsProps, Typography } from "antd";

const BankPage = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { account, loading } = useSelector((state: RootState) => state.userBanks);
  const hasBankAccounts = account && isArrayAndNotEmpty(account.banks);
  const banksAccounts = hasBankAccounts ? account.banks : [];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOkBtnActive, setIsBtnActive] = useState<boolean>(false);
  const [modalResult, setModalResult] = useState(null);

  const onEdit = (action: 'add' | 'remove') => {
    if (action === 'add') {
      setIsOpen(true);
    }
  };

  const onOkHandler = () => {
    setIsOpen(false);
    setModalResult(null);
  };

  const items: TabsProps['items'] = banksAccounts.map((bank) => ({
    key: bank.bankName,
    label: <Typography.Text>{CompaniesNames[bank.bankName] || bank.bankName}</Typography.Text>,
    children: <BankAccountPage key={bank._id} user={user} bankAccount={bank} loading={loading} />,
    closable: false
  }));

  return (
    <div className="page-container bank-account">
      <div className="title-container">
        <div className="page-title">{t('pages.bankAccount')}</div>
      </div>
      <div className="page-inner-container">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(key) => {
            if (key === 'add_account') {
              setIsOpen(true);
            }
          }}
          onEdit={(_, action) => onEdit(action)}
          type="editable-card"
        />
        {!hasBankAccounts && (
          <p>Connect your bank account on the '+' button to see details</p>
        )}
      </div>
      <Modal open={isOpen} onCancel={() => setIsOpen(false)} okButtonProps={{ disabled: !isOkBtnActive }} onOk={onOkHandler}>
        {!modalResult && (
          <ConnectBankForm
            user={user}
            handleOkButton={setIsBtnActive}
            setResult={setModalResult}
          />
        )}
        {modalResult?.account && (
          <Result
            status="success"
            title="Successfully Connected To Your Bank Account!"
            subTitle={`Account number: ${modalResult.account?.accountNumber} Added. Current balance of ${modalResult.account?.balance} added to your account`}
          />
        )}
      </Modal>
    </div>
  );
};

export default BankPage;