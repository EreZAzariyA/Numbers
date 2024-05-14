import { Col, Row, Space, Spin, Tooltip, Typography, message } from "antd";
import { SCRAPERS } from "../../utils/definitions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";
import bankServices from "../../services/banks";
import { UserBankModel } from "../../models/user-model";
import { asNumString, getTimeToRefresh } from "../../utils/helpers";

interface BankAccountPageProps {
  bankAccount: UserBankModel;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const lastConnection = props.bankAccount?.lastConnection
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accountDetails = props.bankAccount?.details;

  const refreshBankData = async () => {
    setIsLoading(true);

    try {
      const response = await bankServices.updateBankData(props.bankAccount?._id, user?._id);
      if (response) {
        message.success('Account data updated...');
        if (response.importedTransactions.length) {
          message.success(`${response.importedTransactions.length} invoices updated successfully`);
        }
      }
    } catch (err: any) {
      console.log(err);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Row justify={'center'}>
        <Col span={24}>
          <Space direction="vertical">
            <Typography.Title level={4} style={{ margin: 0 }}>
              {(SCRAPERS as any)[props.bankAccount.bankName]?.name || props.bankAccount?.bankName}
            </Typography.Title>

            {isLoading ? <Spin /> : (
              <>
                <Typography.Text>Last Update: {lastConnectionDateString}</Typography.Text>
                {accountDetails && (
                  <Typography.Text>Balance: {asNumString(accountDetails?.balance)}</Typography.Text>
                )}

                <Tooltip title={!isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''}>
                  <Typography.Link disabled={!isRefreshAvailable} onClick={refreshBankData}>Refresh</Typography.Link>
                </Tooltip>

              </>
            )}
          </Space>
        </Col>
      </Row>

    </div>
  );
};

export default BankAccountPage;