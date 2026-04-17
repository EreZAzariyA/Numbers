import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { useMutation } from "@tanstack/react-query";
import { useBanks, BANKS_QUERY_KEY } from "../../hooks/useBanks";
import bankServices from "../../services/banks";
import queryClient from "../../services/queryClient";
import BankAccountPage from "./BankAccountPage";
import { ConnectBankFormType } from "./ConnectBankForm";
import { ConnectBankModel } from "../components/CustomModal";
import { getCompanyName, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, Flex, Spin, Tabs, TabsProps, Typography } from "antd";
import { CiBank } from "react-icons/ci";
import "./bank-page.css";

const BankPage = () => {
  const { t } = useTranslation();
  const { modal, message } = App.useApp();
  const { user, loading: userLoading } = useAppSelector((state) => state.auth);
  const { data: account, isLoading: loading } = useBanks();
  const hasBankAccounts = account && isArrayAndNotEmpty(account.banks);
  const banksAccounts = hasBankAccounts ? account.banks : [];

  const removeMutation = useMutation({
    mutationFn: ({ bank_id }: { bank_id: string }) =>
      bankServices.removeBankAccount(user._id, bank_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY, user._id] }),
  });
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mappedBanks = new Map();
  banksAccounts.forEach((b) => mappedBanks.set(b._id, getCompanyName(b.bankName)));

  const sortedArr = [...banksAccounts].sort((a, b) => (b.isMainAccount ? 1 : 0) - (a.isMainAccount ? 1 : 0));
  const mainAccount = sortedArr.find((bank) => bank.isMainAccount);
  const providersCount = sortedArr.filter((bank) => bank.isCardProvider).length;
  const items: TabsProps['items'] = sortedArr.map((bank) => ({
    key: bank._id,
    label: <Typography.Text>{getCompanyName(bank.bankName)}</Typography.Text>,
    children: <BankAccountPage key={bank._id} user={user} bankAccount={bank} />,
    closable: true,
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRemoveBank = async (bank_id: string) => {
    const bank = mappedBanks.get(bank_id);

    const removeBank = async () => {
      try {
        await removeMutation.mutateAsync({ bank_id });
        message.success(t('bankPage.messages.removed', { bank }));
      } catch (error: any) {
        message.error(error?.message || error);
      }
    };

    modal.confirm({
      content: t('bankPage.messages.removeConfirm', { bank }),
      onOk: async () => await removeBank(),
      okButtonProps: {
        danger: true
      }
    });
  };

  return (
    <>
      <Flex vertical gap={5} className="page-container bank-account">
        <div className="page-shell">
          <div className="page-heading">
            <div className="page-heading-copy">
              <div className="page-kicker">{t('bankPage.kicker')}</div>
              <Typography.Title level={2} className="page-title">{t('pages.bankAccount')}</Typography.Title>
              <Typography.Text className="page-subtitle">
                {t('bankPage.subtitle')}
              </Typography.Text>
            </div>
            <div className="page-toolbar">
              <Button type="primary" onClick={() => setIsOpen(true)}>
                {hasBankAccounts ? t('bankPage.connectAnother') : t('bankPage.empty.button')}
              </Button>
            </div>
          </div>

          <div className="page-stat-grid">
            <div className="page-stat-card">
              <span className="page-stat-label">{t('bankPage.summary.connectedBanks')}</span>
              <span className="page-stat-value">{sortedArr.length}</span>
              <span className="page-stat-caption">{t('bankPage.summary.connectedBanksCaption')}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t('bankPage.summary.primaryAccount')}</span>
              <span className="page-stat-value">{mainAccount ? getCompanyName(mainAccount.bankName) : t('bankPage.summary.notSet')}</span>
              <span className="page-stat-caption">{t('bankPage.summary.primaryAccountCaption')}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t('bankPage.summary.cardProviders')}</span>
              <span className="page-stat-value">{providersCount}</span>
              <span className="page-stat-caption">{t('bankPage.summary.cardProvidersCaption')}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t('bankPage.summary.savedCredentials')}</span>
              <span className="page-stat-value">{sortedArr.filter((bank) => !!bank.credentials).length}</span>
              <span className="page-stat-caption">{t('bankPage.summary.savedCredentialsCaption')}</span>
            </div>
          </div>
        </div>

        {userLoading ? <Spin /> : (
          <>
            {hasBankAccounts && (
              <div className="page-panel">
                <div className="page-panel-header">
                  <div>
                    <div className="page-panel-title">{t('bankPage.panel.title')}</div>
                    <div className="page-panel-subtitle">{t('bankPage.panel.subtitle')}</div>
                  </div>
                </div>
                <Tabs
                  defaultActiveKey={items?.[0]?.key?.toString()}
                  items={items}
                  hideAdd
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
              </div>
            )}
            {!hasBankAccounts && (
              <div className="bank-empty-state">
                <div className="bank-empty-icon">
                  <CiBank size={48} />
                </div>
                <Typography.Title level={4} className="bank-empty-title">{t('bankPage.empty.title')}</Typography.Title>
                <Typography.Text className="bank-empty-desc">
                  {t('bankPage.empty.desc')}
                </Typography.Text>
                <Button type="primary" size="large" onClick={() => setIsOpen(true)} className="bank-empty-btn">
                  {t('bankPage.empty.button')}
                </Button>
              </div>
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
