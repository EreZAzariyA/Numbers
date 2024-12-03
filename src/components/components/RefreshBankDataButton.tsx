import dayjs from "dayjs";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { refreshBankData } from "../../redux/actions/bank-actions";
import { getTimeToRefresh, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, ButtonProps, Tooltip } from "antd"
import { BankAccountModel } from "../../models/bank-model";
import { RefreshedBankAccountDetails } from "../../utils/transactions";

interface RefreshBankDataButtonProps {
  buttonProps?: ButtonProps;
  bank?: BankAccountModel;
}

export const RefreshBankDataButton = (props: RefreshBankDataButtonProps) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { account } = useAppSelector((state) => state.userBanks);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const banksToRefresh: BankAccountModel[] = props.bank ? [props.bank] : [...account?.banks || []];

  const lastConnection = !isArrayAndNotEmpty(banksToRefresh) ? null : banksToRefresh
    .sort((a, b) => (
      b?.lastConnection - a?.lastConnection
    ))?.[0]?.lastConnection;

  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const results = banksToRefresh.map(async (bank) =>
        await dispatch(refreshBankData({ bank_id: bank._id, user_id: user._id }))
          .unwrap()
          .catch((err) => {
            console.log({err});
            return message.error(`An error occurred while trying to refresh ${bank.bankName}, ${err.message}`)
          })
      );

      const res = await Promise.all(results);
      if (res.length > 1) {
        message.success('All banks refreshed successfully');
      } else {
        res.forEach((r) => {
          const { importedTransactions = [], bank } = r as RefreshedBankAccountDetails;
          message.success(`Bank: ${bank?.bankName} refreshed successfully. ${importedTransactions.length} transactions updated`);
        });
      }
      setLoading(false);
    } catch (err: any) {
      message.error(err.message || 'An error occurred while trying to refresh banks, open the console to see more details');
    }
  };

  return (
    <Tooltip title={!isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''}>
      <Button
        {...props.buttonProps}
        loading={loading}
        disabled={!isRefreshAvailable}
        onClick={handleRefresh}
      >
        Refresh Bank Data
      </Button>
    </Tooltip>
  )
}