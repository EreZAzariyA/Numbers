import dayjs from "dayjs";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { refreshBankData } from "../../redux/actions/bank-actions";
import { getTimeToRefresh, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, ButtonProps, Tooltip } from "antd"


export const RefreshBankDataButton = (props: ButtonProps) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.userBanks);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  const lastConnection = !isArrayAndNotEmpty(account?.banks) ? null : [...account.banks]
    .sort((a, b) => (
      b?.lastConnection - a?.lastConnection
    ))?.[0]?.lastConnection;

  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const results = account.banks.map(async (bank) => {
        return await dispatch(refreshBankData({ bank_id: bank._id, user_id: user._id })).unwrap();
      });
      await Promise.all(results);
      setLoading(false);
      message.success('All banks refreshed successfully');
    } catch (err: any) {
      message.error(err.message || 'An error occurred while refreshing banks');
    }
  };

  return (
    <Tooltip title={!isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''}>
      <Button
        {...props}
        loading={loading}
        disabled={!isRefreshAvailable}
        onClick={handleRefresh}
      >
        Refresh Bank Data
      </Button>
    </Tooltip>
  )
}