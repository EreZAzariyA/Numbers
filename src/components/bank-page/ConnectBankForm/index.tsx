import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import UserModel from "../../../models/user-model";
import { BankAccountDetails, BankAccountModel } from "../../../models/bank-model";
import { connectBankAccount } from "../../../redux/actions/bank-actions";
import { importTransactions } from "../../../redux/actions/transaction-actions";
import bankServices from "../../../services/banks";
import { CompaniesNames, SupportedCompaniesTypes, SupportedScrapers } from "../../../utils/definitions";
import { Transaction } from "../../../utils/transactions";
import { MenuItem, getMenuItem } from "../../../utils/antd-types";
import { isArray, isArrayAndNotEmpty } from "../../../utils/helpers";
import { App, Button, Checkbox, Form, Input, Select, Space, Typography } from "antd";
import TransactionModel from "../../../models/transaction";
import { ImportModal } from "./ImportModal";

export enum ConnectBankFormType {
  Connect_Bank = "Connect_Bank",
  Update_Bank = "Update_Bank"
};

interface ConnectBankFormProps {
  user: UserModel;
  setIsOkBtnActive?: (val: boolean) => void;
  setResult?: (res: BankAccountDetails) => void;
  formType?: ConnectBankFormType;
  bankDetails?: BankAccountModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const { message, modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { loading: isLoading } = useAppSelector((state) => state.userBanks);
  const [showImportConfirmationModal, setShowImportConfirmationModal] = useState<boolean>(false);
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

    let res;
    try {
      if (props.formType === ConnectBankFormType.Update_Bank) {
        res = await bankServices.updateBankDetails(props.bankDetails?.bankName, props.user._id, values);
      } else {
        res = await dispatch(connectBankAccount({ details: values, user_id: props.user._id })).unwrap();
      }
      console.log({res});

      if (isArrayAndNotEmpty(res.account.txns)) {
        showTransImportConfirmation(res.account.txns, res);
      }
      props?.setResult(res);
      props.setIsOkBtnActive(true);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const showTransImportConfirmation = async (transactions: Transaction[], res: BankAccountDetails): Promise<void> => {
    const isCardProvider = res.bank?.isCardProvider || false;
    let content: any = `We found ${transactions.length} transactions, would you like to import them?`;

    if (isCardProvider) {
      const cards = res.account?.creditCards || [];

      content = (
        <Space direction="vertical" style={{ width: '100%' }}>
          {cards.map((card) => (
            <ImportModal
              key={card.cardNumber}
              card={card}
              companyId={selectedCompany.companyId}
            />
            ))}
        </Space>
      );
    }

    modal.confirm({
      open: showImportConfirmationModal,
      okText: isCardProvider ? 'Done' : 'Import',
      closable: false,
      onOk: async () => {
        if (isCardProvider) {
          setShowImportConfirmationModal(false);
        } else {
          await onTransactionsImportOk(transactions);
        }
      },
      content
    });
  };

  const onTransactionsImportOk = async (transactions: Transaction[]): Promise<TransactionModel[]> => {
    try {
      const res = await dispatch(importTransactions({
        transactions,
        user_id: props.user._id,
        companyId: (SupportedCompaniesTypes as any)[selectedCompany.companyId]
      })).unwrap();
      if (res && isArray(res)) {
        console.log(res);
        message.success(`imported transactions: ${res?.length || 0}`);
      }
      return res;
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