import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store"
import { useBanks } from "../../hooks/useBanks";
import { useBankRefresh } from "../../hooks/useBankRefresh";
import { getCompanyName } from "../../utils/helpers";
import { App, Button, ButtonProps, Tooltip } from "antd"
import { BankAccountModel } from "../../models/bank-model";
import ConnectBankForm, { ConnectBankFormType } from "../bank-page/ConnectBankForm";
import ScrapingProgressModal from "./ScrapingProgressModal";

interface RefreshBankDataButtonProps {
  buttonProps?: ButtonProps;
  bank?: BankAccountModel;
}

export const RefreshBankDataButton = (props: RefreshBankDataButtonProps) => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const { data: account } = useBanks();
  const { user } = useAppSelector((state) => state.auth);
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);

  const banksToRefresh: BankAccountModel[] = props.bank ? [props.bank] : [...account?.banks || []];
  const {
    clearRefreshState,
    handleSingleRefreshComplete,
    handleSingleRefreshFailure,
    isRefreshAvailable,
    loading,
    refreshManyBanks,
    scrapingBankName,
    scrapingJobId,
    startSingleRefresh,
    timeLeftToRefreshData,
  } = useBankRefresh({
    banks: banksToRefresh,
    userId: user._id,
  });

  const showModal = () => {
    setIsOkBtnActive(false);
    modal.confirm({
      icon: null,
      closable: true,
      maskClosable: true,
      destroyOnClose: true,
      width: 400,
      okButtonProps: {
        disabled: !isOkBtnActive
      },
      cancelButtonProps: {
        disabled: loading
      },
      content: (
        <ConnectBankForm
          formType={ConnectBankFormType.Update_Bank}
          user={user}
          bankDetails={props.bank}
          setIsOkBtnActive={setIsOkBtnActive}
        />
      ),
    });
  };

  const handleRefresh = async () => {
    // Single bank path — keep modal flow
    if (props.bank) {
      if (!props.bank?.credentials) return showModal();
      try {
        await startSingleRefresh(props.bank);
      } catch (err: any) {
        message.error(err?.message || t('bank.refreshError'));
        handleSingleRefreshFailure();
      }
      return;
    }

    // Multi-bank path — sequential, toast notifications
    const validBanks = banksToRefresh.filter(b => b.credentials);
    const invalidBanks = banksToRefresh.filter(b => !b.credentials);
    invalidBanks.forEach(b =>
      message.warning(t('bank.noCredentials', { name: getCompanyName(b.bankName) }))
    );
    if (!validBanks.length) return;
    await refreshManyBanks(validBanks);
  };

  const title = !isRefreshAvailable && timeLeftToRefreshData
    ? t('bank.refreshAvailableAt', { time: timeLeftToRefreshData.fromNow() })
    : '';

  return (
    <>
      <ScrapingProgressModal
        jobId={scrapingJobId}
        bankName={scrapingBankName}
        onComplete={(data) => {
          handleSingleRefreshComplete();
          message.success(t('bank.refreshSuccess', { name: getCompanyName(data.bank.bankName) }));
        }}
        onFailed={(err) => {
          handleSingleRefreshFailure();
          message.error(err);
        }}
        onClose={clearRefreshState}
      />
      <Tooltip title={title}>
        <Button
          {...props.buttonProps}
          type="default"
          loading={loading}
          disabled={!isRefreshAvailable}
          onClick={handleRefresh}
          className="refresh-bank-btn"
        >
          {t('bank.refreshBtn')}
        </Button>
      </Tooltip>
    </>
  );
};
