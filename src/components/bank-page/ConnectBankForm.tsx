import { Button, Checkbox, Form, Input, Modal, Result, Select, Space, Typography, message } from "antd";
import { SCRAPERS, SupportedCompanyTypes } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/types";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { Transaction } from "../../utils/transactions";
import bankServices from "../../services/banks";
import { isArray } from "../../utils/helpers";

const { confirm } = Modal;

interface ConnectBankFormProps {
  user: UserModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState();
  const [result, setResult] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: false,
    name: '',
    loginFields: []
  });

  // useEffect(() => {
  //   if (props.user.bank?.credentials) {
  //     const credentials: any = jwtDecode(props.user.bank.credentials);
  //     setCredentials(credentials);
  //     onSelectCompany(credentials.companyId);
  //   }
  // }, [props.user]);

  const bankList: MenuItem[] = Object.entries(SupportedCompanyTypes).map(([bank, value]) => (
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
      setResult(res);
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
    <>
      {!result && (
        <Space className="w-100" direction="vertical" size={'large'}>
          <Typography.Title
            style={{ margin: 0, textDecoration: 'underline' }}
            level={4}
          >
            Connect your bank account
          </Typography.Title>

          <Form
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item label="Select your bank" name={'companyId'}>
              <Select options={bankList} placeholder='Select Bank' onSelect={(e) => onSelectCompany(e)} />
            </Form.Item>

            {selectedCompany.isSelected && (
              <>
                <h2>{selectedCompany.name}</h2>
                {selectedCompany.loginFields.map((field) => (
                  <Form.Item initialValue={credentials ? (credentials as any)[field] : ''} name={field} label={field} key={field}>
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
            >
              <Checkbox>Save my credentials</Checkbox>
            </Form.Item>

            <Button loading={isLoading} type="link" htmlType="submit">Check</Button>
          </Form>
        </Space>
      )}
      {result?.account && (
        <Result
          status="success"
          title="Successfully Connected To Your Bank Account!"
          subTitle={`Account number: ${result.account.accountNumber} Added. Amount of ${result.account.balance} added to your account`}
        />
      )}
    </>
  );
};

export default ConnectBankForm;