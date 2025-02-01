import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { removeBankAccount } from "../../redux/actions/bank-actions";
import BankAccountPage from "./BankAccountPage";
import { ConnectBankFormType } from "./ConnectBankForm";
import { ConnectBankModel } from "../components/CustomModal";
import { getCompanyName, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Flex, Spin, Tabs, TabsProps, Typography } from "antd";

const BankPage = () => {
  const { t } = useTranslation();
  const { modal, message } = App.useApp();
  const dispatch = useAppDispatch();
  const { user, loading: userLoading } = useAppSelector((state) => state.auth);
  const { account, loading, mainAccountLoading } = useAppSelector((state) => state.userBanks);
  const hasBankAccounts = account && isArrayAndNotEmpty(account.banks);
  const banksAccounts = hasBankAccounts ? account.banks : [];
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mappedBanks = new Map();
  banksAccounts.forEach((b) => mappedBanks.set(b._id, getCompanyName(b.bankName)));

  const sortedArr = [...banksAccounts].sort((a, b) => (b.isMainAccount ? 1 : 0) - (a.isMainAccount ? 1 : 0));
  const items: TabsProps['items'] = sortedArr.map((bank) => ({
    key: bank._id,
    label: <Typography.Text>{getCompanyName(bank.bankName)}</Typography.Text>,
    children: <BankAccountPage key={bank._id} user={user} bankAccount={bank} loading={loading} mainAccountLoading={mainAccountLoading} />,
    closable: true,
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRemoveBank = async (bank_id: string) => {
    const bank = mappedBanks.get(bank_id);

    const removeBank = async () => {
      try {
        await dispatch(removeBankAccount({
          bank_id,
          user_id: user?._id
        })).unwrap();
        message.success(`Bank ${bank} removed successfully.`);
      } catch (error: any) {
        console.log(error);
        message.error(error);
      }
    };

    modal.confirm({
      content: `Are you sure you want to remove ${bank}?`,
      onOk: async () => await removeBank(),
      okButtonProps: {
        danger: true
      }
    });
  };

  return (
    <>
      <Flex vertical gap={5} className="page-container bank-account">
        <Typography.Title level={2} className="page-title">{t('pages.bankAccount')}</Typography.Title>
        {userLoading ? <Spin /> : (
          <>
            <Tabs
              defaultActiveKey="1"
              items={items}
              onEdit={(e, action) => {
                switch (action) {
                  case 'add':
                    setIsOpen(true);
                    break;
                  case 'remove':
                    handleRemoveBank(e.toString());
                    break;
                }
              }}
              type="editable-card"
            />
            {!hasBankAccounts && (
              <p>Connect your bank account on the '+' button to see details</p>
            )}
          </>
        )}
      </Flex>
      <ConnectBankModel
        formType={ConnectBankFormType.Connect_Bank}
        user={user}
        setIsOkBtnActive={setIsOkBtnActive}
        setIsOpen={setIsOpen}
        modalProps={{
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