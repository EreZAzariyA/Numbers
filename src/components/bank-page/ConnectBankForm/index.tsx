import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import { useBanks } from "../../../hooks/useBanks";
import queryClient from "../../../services/queryClient";
import UserModel from "../../../models/user-model";
import { BankAccountModel } from "../../../models/bank-model";
import bankServices from "../../../services/banks";
import transactionsServices from "../../../services/transactions";
import { SupportedCompaniesTypes, SupportedScrapers } from "../../../utils/definitions";
import { MenuItem, getMenuItem } from "../../../utils/antd";
import { getCompanyName, isArrayAndNotEmpty } from "../../../utils/helpers";
import { invalidateFinancialQueries } from "../../../utils/queryInvalidation";
import { App, Button, Checkbox, Form, Input, Select, Space, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { CiBank } from "react-icons/ci";
import { TransactionsAccountResponse } from "../../../utils/types";
import ScrapingProgressModal from "../../components/ScrapingProgressModal";
import "./ConnectBankForm.css";

export enum ConnectBankFormType {
  Connect_Bank = "Connect_Bank",
  Update_Bank = "Update_Bank"
};

interface ConnectBankFormProps {
  user: UserModel;
  setIsOkBtnActive?: (val: boolean) => void;
  setResult?: (res: BankAccountModel) => void;
  formType?: ConnectBankFormType;
  bankDetails?: BankAccountModel;
};

const ConnectBankForm = (props: ConnectBankFormProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { data: account } = useBanks();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [scrapingJobId, setScrapingJobId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState({
    isSelected: props.bankDetails?.bankName || false,
    companyId: props.bankDetails?.bankName || null,
    loginFields: props.bankDetails?.bankName ? SupportedScrapers[props.bankDetails.bankName].loginFields : []
  });

  const userBanks = account.banks?.map((bank) => bank?.bankName);
  const bankList: MenuItem[] = Object.entries(SupportedCompaniesTypes).map(([bank, value]) => ({
    ...getMenuItem(getCompanyName(bank), bank, null, null, null, null, value),
    disabled: userBanks.includes(bank)
  }));

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

  const handleImport = async (
    data: { bank: BankAccountModel; account: TransactionsAccountResponse },
    reportProgress?: (count: number) => void
  ): Promise<void> => {
    const { bank, account } = data;
    const isCardProvider = bank?.isCardProvider || false;
    let total = 0;

    if (isCardProvider && account?.cardsPastOrFutureDebit?.cardsBlock) {
      for (const card of account.cardsPastOrFutureDebit.cardsBlock) {
        if (isArrayAndNotEmpty(card.txns)) {
          const result = await transactionsServices.importTransactions(
            props.user._id,
            card.txns,
            (SupportedCompaniesTypes as any)[selectedCompany.companyId]
          );
          total += result.length;
          reportProgress?.(total);
        }
      }
    } else if (isArrayAndNotEmpty(account?.txns)) {
      const result = await transactionsServices.importTransactions(
        props.user._id,
        account.txns,
        (SupportedCompaniesTypes as any)[selectedCompany.companyId]
      );
      total += result.length;
      reportProgress?.(total);
    }
  };

  const handleScrapingResult = (data: { bank: BankAccountModel; account: TransactionsAccountResponse }) => {
    void invalidateFinancialQueries(queryClient, authUser?._id);
    props?.setResult?.(data.bank);
    props?.setIsOkBtnActive?.(true);
  };

  const onFinish = async (values: any) => {
    if (!props.user._id) {
      message.error(t('errors.userNotDefined'));
      return;
    }

    try {
      if (props.formType === ConnectBankFormType.Update_Bank) {
        const result = await bankServices.updateBankDetails(props.bankDetails._id, props.user._id, values);
        await handleImport(result).catch(() => {});
        handleScrapingResult(result);
      } else {
        const { jobId } = await bankServices.connectBank(props.user._id, values);
        setScrapingJobId(jobId);
      }
    } catch (err: any) {
      message.error(err?.message || err);
    }
  };

  const isConnect = !props.formType || props.formType === ConnectBankFormType.Connect_Bank;

  return (
    <Space className="w-100" direction="vertical" size={0}>
      {/* Header */}
      <div className="connect-bank-header">
        <div className="connect-bank-header-icon">
          <CiBank size={22} />
        </div>
        <div className="connect-bank-header-text">
          <Typography.Title level={5} className="connect-bank-title">
            {isConnect ? t('connectBank.connectTitle') : t('connectBank.updateTitle')}
          </Typography.Title>
          <span className="connect-bank-subtitle">
            {isConnect ? t('connectBank.connectSubtitle') : t('connectBank.updateSubtitle')}
          </span>
        </div>
      </div>

      <ScrapingProgressModal
        jobId={scrapingJobId}
        bankName={selectedCompany.companyId ? getCompanyName(selectedCompany.companyId) : undefined}
        onImport={handleImport}
        onComplete={(data) => {
          handleScrapingResult(data);
        }}
        onFailed={(err) => {
          message.error(err);
        }}
        onClose={() => setScrapingJobId(null)}
      />

      <Form
        className="connect-bank-form"
        validateTrigger="onChange"
        onFinish={onFinish}
        layout="vertical"
        disabled={!!scrapingJobId}
      >
        <Form.Item
          name={'companyId'}
          label={t('connectBank.selectBankLabel')}
          initialValue={props.bankDetails?.bankName}
        >
          <Select
            options={bankList}
            placeholder={t('connectBank.selectBankPlaceholder')}
            onSelect={(e) => onSelectCompany(e)}
          />
        </Form.Item>

        {selectedCompany.isSelected && (
          <>
            <div className="connect-bank-selected-badge">
              <CheckCircleFilled />
              {getCompanyName(selectedCompany.companyId)}
            </div>
            {selectedCompany.loginFields.map((field: any) => (
              <Form.Item
                key={field}
                name={field}
                label={t(`connectBank.fieldLabels.${field}`, { defaultValue: field })}
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
          extra={t('connectBank.saveCredentialsExtra')}
          className="connect-bank-save-row"
        >
          <Checkbox>{t('connectBank.saveCredentials')}</Checkbox>
        </Form.Item>

        <Button
          loading={!!scrapingJobId}
          disabled={!selectedCompany.companyId || !!scrapingJobId}
          type="primary"
          htmlType="submit"
          className="connect-bank-submit"
        >
          {isConnect ? t('connectBank.connectBtn') : t('connectBank.updateBtn')}
        </Button>
      </Form>
    </Space>
  );
};

export default ConnectBankForm;
