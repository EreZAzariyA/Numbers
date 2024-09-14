import { App, Button, ButtonProps } from "antd"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { refreshBankData } from "../../redux/actions/bank-actions";
import { useState } from "react";


export const RefreshBankDataButton = (props: ButtonProps) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.userBanks);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

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
    <Button
      {...props}
      loading={loading}
      onClick={handleRefresh}
    >
      Refresh Bank Data
    </Button>
  )
}