import { Col, Row, Space, Spin, Tooltip, Typography, message } from "antd";
import { CompaniesNames } from "../../../utils/definitions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useState } from "react";
import bankServices from "../../../services/banks";
import UserModel from "../../../models/user-model";
import { asNumString, getTimeToRefresh, isArrayAndNotEmpty } from "../../../utils/helpers";
import CustomModal from "../../components/CustomModal";
import ConnectBankForm, { ConnectBankFormType } from "../ConnectBankForm";
import { BankAccountModel } from "../../../models/bank-model";

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const lastConnection = props.bankAccount?.lastConnection
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  const isRefreshAvailable = dayjs() > timeLeftToRefreshData;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accountDetails = props.bankAccount?.details;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refreshData = async () => {
    setIsLoading(true);

    try {
      const response = await bankServices.refreshBankData(props.bankAccount?.bankName, props.user?._id);
      if (response) {
        message.success('Account data updated...');
        if (response.account?.txns && isArrayAndNotEmpty(response.account.txns)) {
          message.success(`${response.account.txns?.length} invoices updated successfully`);
        }
      }
    } catch (err: any) {
      console.log(err);
    }

    setIsLoading(false);
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
              {CompaniesNames[props.bankAccount.bankName] || props.bankAccount?.bankName}
            </Typography.Title>

            {isLoading ? <Spin /> : (
              <Space direction="vertical">
                <Typography.Text>Last Update: {lastConnectionDateString}</Typography.Text>
                {accountDetails && (
                  <Typography.Text>Balance: {asNumString(accountDetails?.balance)}</Typography.Text>
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