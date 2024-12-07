import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import BankAccountPage from "./BankAccountPage";
import { ConnectBankFormType } from "./ConnectBankForm";
import { ConnectBankModel } from "../components/CustomModal";
import { getCompanyName, isArrayAndNotEmpty } from "../../utils/helpers";
import { Spin, Tabs, TabsProps, Typography } from "antd";

const BankPage = () => {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useAppSelector((state) => state.auth);
  const { account, loading, mainAccountLoading } = useAppSelector((state) => state.userBanks);
  const hasBankAccounts = account && isArrayAndNotEmpty(account.banks);
  const banksAccounts = hasBankAccounts ? account.banks : [];
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sortedArr = [...banksAccounts].sort((a, b) => (b.isMainAccount ? 1 : 0) - (a.isMainAccount ? 1 : 0));
  const items: TabsProps['items'] = sortedArr.map((bank) => ({
    key: bank.bankName,
    label: <Typography.Text>{getCompanyName(bank.bankName)}</Typography.Text>,
    children: <BankAccountPage key={bank._id} user={user} bankAccount={bank} loading={loading} mainAccountLoading={mainAccountLoading} />,
    closable: false,
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="page-container bank-account">
        <div className="title-container">
          <div className="page-title">{t('pages.bankAccount')}</div>
        </div>
        {userLoading ? <Spin /> : (
          <div className="page-inner-container">
            <Tabs
              defaultActiveKey="1"
              items={items}
              onEdit={(_, action) => {
                if (action === 'add') {
                  setIsOpen(true);
                }
              }}
              type="editable-card"
            />
            {!hasBankAccounts && (
              <p>Connect your bank account on the '+' button to see details</p>
            )}
          </div>
        )}
      </div>
      <ConnectBankModel
        formType={ConnectBankFormType.Connect_Bank}
        user={user}
        setIsOkBtnActive={setIsOkBtnActive}
        setIsOpen={setIsOpen}
        modalProps={{
          closable: true,
          open: isOpen,
          onOk: () => {
            setIsOpen(false);
          },
          onCancel: handleClose,
          onClose: handleClose,
          okButtonProps: {
            disabled: !isOkBtnActive
          },
          cancelButtonProps: {
            disabled: loading || isOkBtnActive
          }
        }}
      />
    </>
  );
};

export default BankPage;