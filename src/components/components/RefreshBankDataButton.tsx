import { useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { refreshBankData } from "../../redux/actions/bank-actions";
import { getCompanyName, getTimeToRefresh, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, ButtonProps, Tooltip } from "antd"
import { BankAccountModel } from "../../models/bank-model";
import { RefreshedBankAccountDetails } from "../../utils/transactions";
import ConnectBankForm, { ConnectBankFormType } from "../bank-page/ConnectBankForm";

interface RefreshBankDataButtonProps {
  buttonProps?: ButtonProps;
  bank?: BankAccountModel;
}

export const RefreshBankDataButton = (props: RefreshBankDataButtonProps) => {
  const dispatch = useAppDispatch();
  const { message, modal } = App.useApp();
  const { account } = useAppSelector((state) => state.userBanks);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);

  const banksToRefresh: BankAccountModel[] = props.bank ? [props.bank] : [...account?.banks || []];

  const lastConnection = !isArrayAndNotEmpty(banksToRefresh) ? null : banksToRefresh
    .sort((a, b) => (
      b?.lastConnection - a?.lastConnection
    ))?.[0]?.lastConnection;

  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;

  const showModal = () => {
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
    setLoading(true);
    if (props.bank && !props.bank?.credentials) {
      setLoading(false);
      return showModal();
    }

    try {
      const successedBanks: string[] = [];
      let allImportedTransactions: number = 0;
      const results = banksToRefresh.map(async (bank) => {
        const bankName = getCompanyName(bank.bankName);
        if (!bank.credentials) {
          return message.error(`Could not refresh ${bankName}. No Credentials found`);
        };

        return await dispatch(refreshBankData({ bank_id: bank._id, user_id: user._id }))
          .unwrap()
          .catch((err) => {
            console.log({err});
            return message.error(`An error occurred while trying to refresh ${bankName}, ${err}`)
          })
        }
      );

      const res = await Promise.all(results);
      if (res.some((r) => typeof r !== 'boolean')) {

        res.forEach((r) => {
          const { importedTransactions = [], bank } = r as RefreshedBankAccountDetails;
          if (r && bank) {
            const bankName = getCompanyName(bank.bankName);
            successedBanks.push(bankName);
            allImportedTransactions += importedTransactions.length || 0;
          }
        });
      }
      message.success(`Banks: ${successedBanks.join(', ')} refreshed successfully. ${allImportedTransactions} transactions updated`);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      message.error(err.message || 'An error occurred while trying to refresh banks, open the console to see more details');
    }
  };

  const title = !isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''

  return (
    <Tooltip title={title}>
      <Button
        {...props.buttonProps}
        loading={loading}
        disabled={!isRefreshAvailable}
        onClick={handleRefresh}
      >
        Refresh Bank Data
      </Button>
    </Tooltip>
  );
};