import { useSelector } from "react-redux";
import ConnectBankForm from "./ConnectBankForm";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import BankAccountPage from "./BankAccountPage";
import { Modal, Tabs, TabsProps, Typography } from "antd";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { CompaniesNames } from "../../utils/definitions";
import { useState } from "react";

const BankPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const bankAccounts = user.bank;
  const hasBankAccounts = bankAccounts && isArrayAndNotEmpty(bankAccounts);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    label: <Typography.Text>{(CompaniesNames as any)[account.bankName]}</Typography.Text>,
    children: <BankAccountPage bankAccount={account} />,
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
          onChange={onChange}
          onEdit={(_, action) => onEdit(action)}
          type="editable-card"
        />
        <Modal open={isOpen} onCancel={() => setIsOpen(false)}>
          <ConnectBankForm user={user} />
        </Modal>
      </div>
    </div>
  );
};

export default BankPage;