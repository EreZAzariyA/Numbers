import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime"
import { AppDispatch } from "../../../redux/store";
import { setBankAsMainAccount } from "../../../redux/actions/bank-actions";
import UserModel from "../../../models/user-model";
import { ConnectBankFormType } from "../ConnectBankForm";
import { ConnectBankModel } from "../../components/CustomModal";
import { RefreshBankDataButton } from "../../components/RefreshBankDataButton";
import { BankAccountModel } from "../../../models/bank-model";
import { CompaniesNames } from "../../../utils/definitions";
import { asNumString } from "../../../utils/helpers";
import { App, Button, Col, Row, Space, Spin, Typography } from "antd";

dayjs.extend(relativeTime);

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
  loading: boolean;
  mainAccountLoading: boolean;
};

const BankAccountPage = (props: BankAccountPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const { lastConnection, details, bankName, _id: bank_id } = props.bankAccount;
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMainAccount = !!props.bankAccount.isMainAccount;

  const editAccountDetails = () => {
    setIsOpen(true);
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
                asNumString(details?.balance || 0)
              )}
            </Typography.Text>

            <Row align={'middle'} justify={'center'} gutter={[10, 10]}>
              <Col>
                <RefreshBankDataButton
                  bank={props.bankAccount}
                  buttonProps={{
                    type: 'link'
                  }}
                />
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
      <ConnectBankModel
        bank={props.bankAccount}
        user={props.user}
        formType={ConnectBankFormType.Update_Bank}
        setIsOkBtnActive={setIsOkBtnActive}
        setIsOpen={setIsOpen}
        modalProps={{
          open: isOpen,
          onCancel: () => setIsOpen(false),
          onClose: () => setIsOpen(false),
          closable: true,
          confirmLoading: props.loading,
          cancelButtonProps: {
            onClick: () => setIsOpen(false),
            disabled: props.loading
          },
          okButtonProps: {
            disabled: !isOkBtnActive,
            onClick: () => setIsOpen(false),
          },
        }}
      />
    </>
  );
};

export default BankAccountPage;