import { Button, Checkbox, Form, Input, Modal, Result, Select, message } from "antd";
import { SCRAPERS, SupportedCompanyTypes } from "../../utils/definitions";
import { MenuItem, getMenuItem } from "../../utils/types";
import { useEffect, useState } from "react";
import bankServices from "../../services/banks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { jwtDecode } from "jwt-decode";

const { confirm } = Modal;

const ConnectBankForm = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: false,
    name: '',
    loginFields: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (user.bank?.[0]?.credentials) {
      const credentials: any = jwtDecode(user.bank[0].credentials);
      setCredentials(credentials);
      onSelectCompany(credentials.companyId);
    }
  }, [user]);

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
    console.log(values);
    setIsLoading(true);

    try {
      const res = await bankServices.fetchBankData(values, user?._id);
      if (res) {
        if (res?.txns && res.txns?.length) {
          showTransConfirm(res.txns);
        }
        console.log(res);
        setResult(res);
      }
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  const showTransConfirm = async (transactions: any) => {
    confirm({
      okText: 'Import',
      onOk: () => onTransactionsImportOk(transactions),
      content: `We found ${transactions.length} invoices, would you like to import them?`
    });
  };


  const onTransactionsImportOk = async (transactions: any[]) => {
    try {
      const res = await bankServices.importTrans(transactions, user?._id);
      if (res) {
        message.success('OK');
      }
      console.log(res);
    } catch (err: any) {
      message.error(err);
    }
  }

  return (
    <>
      {!result && (
        <Form
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item initialValue={user.bank?.[0]?.bankName} label="Select your bank" name={'companyId'}>
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
      )}
      {result && (
        <Result
          status="success"
          title="Successfully Connected To Your Bank Account!"
          subTitle={`Account number: ${result.accountNumber} Added. Amount of ${result.balance} added to your account`}
        />
      )}
    </>
  );
};

export default ConnectBankForm;