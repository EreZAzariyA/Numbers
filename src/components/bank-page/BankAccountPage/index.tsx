import { Col, message, Row, Space, Spin, Tooltip, Typography } from "antd";
import { CompaniesNames } from "../../../utils/definitions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useState } from "react";
import UserModel from "../../../models/user-model";
import { asNumString, getTimeToRefresh } from "../../../utils/helpers";
import CustomModal from "../../components/CustomModal";
import ConnectBankForm, { ConnectBankFormType } from "../ConnectBankForm";
import { BankAccountModel } from "../../../models/bank-model";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { refreshBankData } from "../../../redux/actions/banks";

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
  loading: boolean;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lastConnection, details, bankName, _id } = props.bankAccount;
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  // const isRefreshAvailable = dayjs() > timeLeftToRefreshData;
  const isRefreshAvailable = true;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refreshData = async () => {
    if (props.loading) {
      return;
    }
    const result = await dispatch(refreshBankData({
      bank_id: _id,
      user_id: props.user?._id
    }));

    if (refreshBankData.fulfilled.match(result)) {
      const { importedTransactions = [] } = result.payload;
      message.success(`${importedTransactions.length} transactions updated successfully`);
    }
  };

  const editAccountDetails = async () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Row justify={'center'}>
        <Col span={24}>
          <Space direction="vertical">
            <Typography.Title level={4} style={{ margin: 0 }}>
              {CompaniesNames[bankName] || bankName}
            </Typography.Title>

            {props.loading ? <Spin /> : (
              <Space direction="vertical">
                <Typography.Text>Last Update: {lastConnectionDateString}</Typography.Text>
                {details && (
                  <Typography.Text>Balance: {asNumString(details.balance)}</Typography.Text>
                )}

                <Row align={'middle'} justify={'center'} gutter={[10, 10]}>
                  <Col>
                    <Tooltip title={!isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''}>
                      <Typography.Link disabled={!isRefreshAvailable} onClick={refreshData}>Refresh</Typography.Link>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Typography.Link onClick={editAccountDetails}>Edit-details</Typography.Link>
                  </Col>
                </Row>
              </Space>
            )}
          </Space>
        </Col>
      </Row>
      <CustomModal
        title="Update bank account"
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      >
        <ConnectBankForm
          user={props.user}
          formType={ConnectBankFormType.Update_Bank}
          bankDetails={props.bankAccount}
        />
      </CustomModal>
    </div>
  );
};

export default BankAccountPage;