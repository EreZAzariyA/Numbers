import { Col, Row, Space, Spin, Tooltip, Typography } from "antd";
import { SCRAPERS } from "../../utils/definitions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";
import bankServices from "../../services/banks";

interface BankAccountPageProps {
  bankAccount: any;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const lastConnection = props.bankAccount?.lastConnection
  const lastConnectionDate = dayjs(lastConnection).fromNow() || null;
  const timeLeftToRefreshData = dayjs(lastConnection).subtract(-5, 'hour');
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshBankData = async () => {
    try {
      const details = await bankServices.fetchBankData(props.bankAccount?.credentials, user?._id);
      console.log(details);
    } catch (err: any) {
      console.log(err);
    }
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
                <Typography.Text>Last Update: {lastConnectionDate}</Typography.Text>

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