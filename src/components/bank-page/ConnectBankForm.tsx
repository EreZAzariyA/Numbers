import { Button, Checkbox, Form, Input, Modal, Select, Space, Typography, message } from "antd";
import { CompaniesNames, SupportedCompaniesTypes, SupportedScrapers } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/antd-types";
import { useState } from "react";
import UserModel, { UserBankModel } from "../../models/user-model";
import { BankAccountDetails, Transaction } from "../../utils/transactions";
import bankServices from "../../services/banks";
import { isArray } from "../../utils/helpers";

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
  bankDetails?: UserBankModel
};

const getLoginFields = (companyId: SupportedCompaniesTypes) => {
  const company = SupportedScrapers[companyId];
  return company.loginFields;
}

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  console.log(props);
  

  const onFinish = async (values: any) => {
    setIsLoading(true);

    if (!props.user._id) {
      message.error('User is not define');
      setIsLoading(false);
      return;
    }

    try {
      let res: Partial<BankAccountDetails> = {};
      if (props.formType === ConnectBankFormType.Update_Bank) {
        res = await bankServices.updateBankDetails(props.bankDetails?._id, props.user._id, values);
      } else {
        res = await bankServices.fetchBankData(values, props.user._id);
      }
      if (res?.account && res.account?.txns && res.account.txns?.length) {
        showTransImportConfirmation(res.account?.txns);
      }
      props?.setResult(res);
      props.handleOkButton(true);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
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