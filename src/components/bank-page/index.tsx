import { useSelector } from "react-redux";
import ConnectBankForm from "./ConnectBankForm";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import BankAccountPage from "./BankAccountPage";
import { Modal, Result, Tabs, TabsProps, Typography } from "antd";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { CompaniesNames } from "../../utils/definitions";
import { useState } from "react";

const BankPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const bankAccounts = user.bank;
  const hasBankAccounts = bankAccounts && isArrayAndNotEmpty(bankAccounts);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOkBtnActive, setIsBtnActive] = useState<boolean>(false);
  const [modalResult, setModalResult] = useState(null);

  const onChange = (key: string) => {
    console.log(key);
    if (key === 'add_account') {
      setIsOpen(true);
    }
  };

  const onEdit = (action: 'add' | 'remove') => {
    if (action === 'add') {
      setIsOpen(true);
    } else {
      
    }
  };

  const items: TabsProps['items'] = !hasBankAccounts ? [] : bankAccounts.map((account) => ({
    key: account.bankName,
    label: <Typography.Text>{CompaniesNames[account.bankName] || account.bankName}</Typography.Text>,
    children: <BankAccountPage user={user} bankAccount={account} />,
    closable: false
  }));

  const onOkHandler = () => {
    setIsOpen(false);
    setModalResult(null);
  };

  return (
    <div className="page-container bank-account">
      <div className="title-container">
        <div className="page-title">{t('pages.bankAccount')}</div>
      </div>
      <div className="page-inner-container">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          onEdit={(_, action) => onEdit(action)}
          type="editable-card"
        />
        {!hasBankAccounts && (
          <p>Connect your bank account on the '+' button to see details</p>
        )}
      </div>
      <Modal open={isOpen} onCancel={() => setIsOpen(false)} okButtonProps={{ disabled: !isOkBtnActive }} onOk={onOkHandler}>
        {!modalResult && (
          <ConnectBankForm user={user} handleOkButton={setIsBtnActive} setResult={setModalResult} />
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