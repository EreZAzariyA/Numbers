import { Button, Checkbox, Form, Input, Result, Select, Space, Typography } from "antd";
import { SCRAPERS, SupportedCompanyTypes } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/types";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { fetchBankAccountData } from "../../utils/transactions";

interface ConnectBankFormProps {
  user: UserModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: false,
    name: '',
    loginFields: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (props.user.bank?.[0]?.credentials) {
      const credentials: any = jwtDecode(props.user.bank[0].credentials);
      setCredentials(credentials);
      onSelectCompany(credentials.companyId);
    }
  }, [props.user]);

  const bankList: MenuItem[] = Object.entries(SupportedCompanyTypes).map(([bank, value]) => {
    return getMenuItem(bank, bank, null, null, null, value)
  });

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
    const accountData = await fetchBankAccountData(null, values, props.user?._id, setIsLoading, true, setResult, )
    console.log(accountData);
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
            <Form.Item initialValue={props.user.bank?.[0]?.bankName} label="Select your bank" name={'companyId'}>
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