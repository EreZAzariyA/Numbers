import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime"
import { AppDispatch } from "../../../redux/store";
import ConnectBankForm, { ConnectBankFormType } from "../ConnectBankForm";
import { CustomModal } from "../../components/CustomModal";
import { refreshBankData, setBankAsMainAccount } from "../../../redux/actions/bank-actions";
import UserModel from "../../../models/user-model";
import { BankAccountModel } from "../../../models/bank-model";
import { CompaniesNames } from "../../../utils/definitions";
import { asNumString, getTimeToRefresh } from "../../../utils/helpers";
import { App, Button, Col, Row, Space, Spin, Tooltip, Typography } from "antd";

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
  loading: boolean;
  mainAccountLoading: boolean;
};
dayjs.extend(relativeTime);

const BankAccountPage = (props: BankAccountPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const { lastConnection, details, bankName, _id: bank_id } = props.bankAccount;
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const timeLeftToRefreshData = getTimeToRefresh(lastConnection);
  // const isRefreshAvailable = dayjs() > timeLeftToRefreshData;
  const isRefreshAvailable = true;
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const isMainAccount = !!props.bankAccount.isMainAccount;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refreshData = async () => {
    if (props.loading) {
      return;
    }

    try {
      const result = await dispatch(refreshBankData({
        bank_id,
        user_id: props.user?._id
      })).unwrap();

      const { importedTransactions = [] } = result;
      message.success(`${importedTransactions.length} transactions updated successfully`);
    } catch (err: any) {
      message.error(err);
    }
  };

  const editAccountDetails = () => {
    setIsOpen(!isOpen);
  };

  const handleSetAsMainAccount = async () => {
    try {
      await dispatch(setBankAsMainAccount({
        bank_id,
        user_id: props.user?._id
      })).unwrap();
      message.success(`${CompaniesNames[bankName]} is now the main account`);
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <>
      <Row justify={'center'} align={'middle'}>
        <Col span={12}>
          <Space align="center" direction="vertical" className="w-100" size={"small"}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {CompaniesNames[bankName] || bankName}
            </Typography.Title>

            <Typography.Text>
              <span>Last Update: </span>
              {props.loading ? (
                <Spin />
              ) : (
                lastConnectionDateString
              )}
            </Typography.Text>

            <Typography.Text>
              <span>Balance: </span>
              {props.loading ? (
              <Spin />
              ) : (
                asNumString(details.balance)
              )}
            </Typography.Text>

            <Row align={'middle'} justify={'center'} gutter={[10, 10]}>
              <Col>
                <Tooltip title={!isRefreshAvailable ? `Refresh will be able ${timeLeftToRefreshData.fromNow()}` : ''}>
                  <Typography.Link disabled={!isRefreshAvailable || props.loading} onClick={refreshData}>Refresh</Typography.Link>
                </Tooltip>
              </Col>
              <Col>
                <Typography.Link disabled={props.loading} onClick={editAccountDetails}>Edit-details</Typography.Link>
              </Col>
            </Row>
            <Row align={'middle'} justify={'center'}>
              <Col>
                <Button disabled={isMainAccount} loading={props.mainAccountLoading} onClick={handleSetAsMainAccount}>Set as main account</Button>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
      <CustomModal
        title="Update bank account"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        cancelButtonProps={{
          onClick: () => setIsOpen(false),
          disabled: props.loading
        }}
        confirmLoading={props.loading}

        okButtonProps={{
          disabled: !isOkBtnActive,
          onClick: () => setIsOpen(false),
        }}
        onClose={() => setIsOpen(false)}
      >
        <ConnectBankForm
          setIsOkBtnActive={setIsOkBtnActive}
          user={props.user}
          formType={ConnectBankFormType.Update_Bank}
          bankDetails={props.bankAccount}
        />
      </CustomModal>
    </>
  );
};

export default BankAccountPage;