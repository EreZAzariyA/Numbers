import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import BankAccountPage from "./BankAccountPage";
import ConnectBankForm from "./ConnectBankForm";
import { CustomModal } from "../components/CustomModal";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { CompaniesNames } from "../../utils/definitions";
import { Result, Spin, Tabs, TabsProps, Typography } from "antd";
import { BankAccountDetails } from "../../models/bank-model";

const BankPage = () => {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useAppSelector((state) => state.auth);
  const { account, loading, mainAccountLoading } = useAppSelector((state) => state.userBanks);
  const hasBankAccounts = account && isArrayAndNotEmpty(account.banks);
  const banksAccounts = hasBankAccounts ? account.banks : [];
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [modalResult, setModalResult] = useState<BankAccountDetails>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isCardProvider = modalResult?.bank?.isCardProvider;
  let modalSubTitle = `Account number: ${modalResult?.account?.accountNumber || modalResult?.account?.cardNumber} Added. Current balance of ${modalResult?.account?.balance} added to your account`;
  if (isCardProvider) {
    const creditCards = modalResult?.account?.creditCards;
    modalSubTitle = `${creditCards?.length} card added into your account`
  }

  const sortedArr = [...banksAccounts].sort((a, b) => (b.isMainAccount ? 1 : 0) - (a.isMainAccount ? 1 : 0));
  const items: TabsProps['items'] = sortedArr
  .map((bank) => ({
    key: bank.bankName,
    label: <Typography.Text>{CompaniesNames[bank.bankName] || bank.bankName}</Typography.Text>,
    children: <BankAccountPage key={bank._id} user={user} bankAccount={bank} loading={loading} mainAccountLoading={mainAccountLoading} />,
    closable: false,
  }));

  const handleClose = () => {
    setIsOpen(false);
    setModalResult(null);
  };

  return (
    <>
      <div className="page-container bank-account">
        <div className="title-container">
          <div className="page-title">{t('pages.bankAccount')}</div>
        </div>
        {userLoading && (
          <Spin />
        )}
        {!userLoading && (
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
      <CustomModal
        open={isOpen}
        onOk={() => {
          setModalResult(null);
          setIsOpen(false);
        }}
        onCancel={handleClose}
        onClose={handleClose}
        okButtonProps={{
          disabled: !isOkBtnActive,
        }}
        cancelButtonProps={{
          disabled: loading || isOkBtnActive
        }}
        footer={modalResult && false}
      >
        <>
          {!modalResult && (
            <ConnectBankForm
              user={user}
              setIsOkBtnActive={setIsOkBtnActive}
              setResult={setModalResult}
            />
          )}
          {modalResult?.account && (
            <Result
              status="success"
              title="Successfully Connected To Your Bank Account!"
              subTitle={modalSubTitle}
            />
          )}
        </>
      </CustomModal>
    </>
  );
};

export default BankPage;