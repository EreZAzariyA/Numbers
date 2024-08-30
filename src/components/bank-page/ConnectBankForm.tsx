import { Button, Checkbox, Form, Input, Modal, Select, Space, Typography, message } from "antd";
import { CompaniesNames, SupportedCompaniesTypes, SupportedScrapers } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/antd-types";
import { useState } from "react";
import UserModel from "../../models/user-model";
import { Transaction } from "../../utils/transactions";
import bankServices from "../../services/banks";
import { isArray, isArrayAndNotEmpty } from "../../utils/helpers";
import { BankAccountModel } from "../../models/bank-model";
import { RootState, useAppDispatch } from "../../redux/store";
import { connectBankAccount } from "../../redux/actions/banks";
import { useSelector } from "react-redux";

const { confirm } = Modal;

export enum ConnectBankFormType {
  Connect_Bank = "Connect_Bank",
  Update_Bank = "Update_Bank"
}

interface ConnectBankFormProps {
  user: UserModel;
  handleOkButton?: (val: boolean) => void;
  setResult?: (res: any) => void;
  formType?: ConnectBankFormType;
  bankDetails?: BankAccountModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const dispatch = useAppDispatch();
  const { loading: isLoading } = useSelector((state: RootState) => state.userBanks);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: props.bankDetails?.bankName || false,
    companyId: props.bankDetails?.bankName || null,
    loginFields: props.bankDetails?.bankName ? SupportedScrapers[props.bankDetails.bankName].loginFields : []
  });

  const bankList: MenuItem[] = Object.entries(SupportedCompaniesTypes).map(([bank, value]) => (
    getMenuItem(CompaniesNames[bank] || bank, bank, null, null, null, value)
  ));

  const onSelectCompany = (companyId: SupportedCompaniesTypes) => {
    const company = SupportedScrapers[companyId];
    if (company) {
      setSelectedCompany({
        isSelected: true,
        companyId,
        loginFields: company.loginFields,
      });
    }
  };

  const onFinish = async (values: any) => {
    if (!props.user._id) {
      message.error('User is not define');
      return;
    }

    try {
      if (props.formType === ConnectBankFormType.Update_Bank) {
        const res = await bankServices.updateBankDetails(props.bankDetails?.bankName, props.user._id, values);
        if (res?.account && res.account?.txns && isArrayAndNotEmpty(res.account.txns)) {
          showTransImportConfirmation(res.account.txns);
        }
        props?.setResult(res);
        props.handleOkButton(true);
      } else {
        const result = await dispatch(connectBankAccount({ details: values, user_id: props.user._id }))

        if (connectBankAccount.fulfilled.match(result)) {
          if (isArrayAndNotEmpty(result.payload.account.txns)) {
            showTransImportConfirmation(result.payload.account.txns);
          }
          props?.setResult(result.payload);
          props.handleOkButton(true);
        }

        return;
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const showTransImportConfirmation = async (transactions: Transaction[]): Promise<void> => {
    confirm({
      okText: 'Import',
      onOk: () => onTransactionsImportOk(transactions),
      content: `We found ${transactions.length} transactions, would you like to import them?`
    });
  };

  const onTransactionsImportOk = async (transactions: Transaction[]): Promise<void> => {
    try {
      const res = await bankServices.importTrans(transactions, props.user._id, (SupportedCompaniesTypes as any)[selectedCompany.companyId]);
      if (res && isArray(res)) {
        message.success(`imported transactions: ${res?.length || 0}`);
      }
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <Space className="w-100" direction="vertical" size={'large'}>
      <Typography.Title
        style={{ margin: 0, textDecoration: 'underline' }}
        level={4}
      >
        {(!props.formType || props.formType === ConnectBankFormType.Connect_Bank) && (
          "Connect your bank account"
        )}
        {props.formType === ConnectBankFormType.Update_Bank && (
          "Update your bank account details"
        )}
      </Typography.Title>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Select your bank" initialValue={props.bankDetails?.bankName} name={'companyId'}>
          <Select options={bankList} placeholder='Select Bank' onSelect={(e) => onSelectCompany(e)} />
        </Form.Item>

        {selectedCompany.isSelected && (
          <>
            <h2>{CompaniesNames[selectedCompany.companyId]}</h2>
            {selectedCompany.loginFields.map((field: any) => (
              <Form.Item
                key={field}
                name={field}
                label={field}
              >
                {field === 'password' ? (
                  <Input.Password autoComplete="off" />
                ) : (
                  <Input type={field || 'text'} autoComplete="off" />
                )}
              </Form.Item>
            ))}
          </>
        )}

        <Form.Item
          name="save"
          valuePropName="checked"
          extra="Save your credentials to update data faster"
        >
          <Checkbox>Save my credentials</Checkbox>
        </Form.Item>

        <Button loading={isLoading} type="link" htmlType="submit">Check</Button>
      </Form>
    </Space>
  );
};

export default ConnectBankForm;