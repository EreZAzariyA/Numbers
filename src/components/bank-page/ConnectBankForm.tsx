import { useState } from "react";
import UserModel from "../../models/user-model";
import { BankAccountModel } from "../../models/bank-model";
import { connectBankAccount } from "../../redux/actions/bank-actions";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import bankServices from "../../services/banks";
import { CompaniesNames, SupportedCompaniesTypes, SupportedScrapers } from "../../utils/definitions";
import { Transaction } from "../../utils/transactions";
import { MenuItem, getMenuItem } from "../../utils/antd-types";
import { isArray, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, Checkbox, Form, Input, Select, Space, Typography } from "antd";

export enum ConnectBankFormType {
  Connect_Bank = "Connect_Bank",
  Update_Bank = "Update_Bank"
};

interface ConnectBankFormProps {
  user: UserModel;
  setIsOkBtnActive?: (val: boolean) => void;
  setResult?: (res: any) => void;
  formType?: ConnectBankFormType;
  bankDetails?: BankAccountModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const { message, modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { loading: isLoading } = useAppSelector((state) => state.userBanks);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: props.bankDetails?.bankName || false,
    companyId: props.bankDetails?.bankName || null,
    loginFields: props.bankDetails?.bankName ? SupportedScrapers[props.bankDetails.bankName].loginFields : []
  });

  const bankList: MenuItem[] = Object.entries(SupportedCompaniesTypes).map(([bank, value]) => (
    getMenuItem(CompaniesNames[bank] || bank, bank, null, null, null, null, value)
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
        props.setIsOkBtnActive(true);
      } else {
        const result = await dispatch(connectBankAccount({ details: values, user_id: props.user._id }))

        if (connectBankAccount.fulfilled.match(result)) {
          if (isArrayAndNotEmpty(result.payload.account.txns)) {
            showTransImportConfirmation(result.payload.account.txns);
          }
          props?.setResult(result.payload);
          props.setIsOkBtnActive(true);
        }

        return;
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const showTransImportConfirmation = async (transactions: Transaction[]): Promise<void> => {
    modal.confirm({
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

      <Form
        validateTrigger="onChange"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name={'companyId'}
          label="Select your bank"
          initialValue={props.bankDetails?.bankName}
        >
          <Select
            options={bankList}
            placeholder='Select Bank'
            onSelect={(e) => onSelectCompany(e)}
          />
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

        <Button loading={isLoading} disabled={!selectedCompany.companyId} type="link" htmlType="submit">Check</Button>
      </Form>
    </Space>
  );
};

export default ConnectBankForm;