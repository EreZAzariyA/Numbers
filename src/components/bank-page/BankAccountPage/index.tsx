import { useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { AppDispatch } from "../../../redux/store";
import UserModel from "../../../models/user-model";
import { BankAccountModel } from "../../../models/bank-model";
import { refreshBankData } from "../../../redux/actions/bank-actions";
import ConnectBankForm, { ConnectBankFormType } from "../ConnectBankForm";
import { CustomModal } from "../../components/CustomModal";
import { CompaniesNames } from "../../../utils/definitions";
import { asNumString, getTimeToRefresh } from "../../../utils/helpers";
import { App, Col, Row, Space, Spin, Tooltip, Typography } from "antd";

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
  loading: boolean;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
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

    try {
      const result = await dispatch(refreshBankData({
        bank_id: _id,
        user_id: props.user?._id
      })).unwrap();

      const { importedTransactions = [] } = result;
      message.success(`${importedTransactions.length} transactions updated successfully`);
    } catch (err: any) {
      message.error(err);
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