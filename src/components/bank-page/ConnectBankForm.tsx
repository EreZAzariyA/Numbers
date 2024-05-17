import { Button, Checkbox, Form, Input, Modal, Result, Select, Space, Typography, message } from "antd";
import { SCRAPERS, SupportedCompaniesTypes } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/types";
import { useState } from "react";
import UserModel from "../../models/user-model";
import { Transaction } from "../../utils/transactions";
import bankServices from "../../services/banks";
import { isArray } from "../../utils/helpers";

const { confirm } = Modal;

interface ConnectBankFormProps {
  user: UserModel;
  handleOkButton?: (val: boolean) => void;
  setResult?: (res: any) => void;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: false,
    name: '',
    loginFields: []
  });

  const bankList: MenuItem[] = Object.entries(SupportedCompaniesTypes).map(([bank, value]) => (
    getMenuItem(bank, bank, null, null, null, value)
  ));

  const onSelectCompany = (companyId: string) => {
    const company = (SCRAPERS as any)[companyId];
    if (company) {
      setSelectedCompany({
        isSelected: true,
        name: company.name,
        loginFields: company.loginFields,
      });
    }
  };

  const onFinish = async (values: any) => {
    setIsLoading(true);

    if (!props.user._id) {
      message.error('User is not define');
      setIsLoading(false);
      return;
    }
  
    try {
      const res = await bankServices.fetchBankData(values, props.user._id);
      if (res?.account && res.account?.txns && res.account.txns?.length) {
        showTransImportConfirmation(res.account?.txns);
      }
      props.setResult(res);
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
      const res = await bankServices.importTrans(transactions, props.user._id);
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
        Connect your bank account
      </Typography.Title>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Select your bank" name={'companyId'}>
          <Select options={bankList} placeholder='Select Bank' onSelect={(e) => onSelectCompany(e)} />
        </Form.Item>

        {selectedCompany.isSelected && (
          <>
            <h2>{selectedCompany.name}</h2>
            {selectedCompany.loginFields.map((field) => (
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