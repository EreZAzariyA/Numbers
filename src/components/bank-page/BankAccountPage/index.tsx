import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime"
import { useMutation } from "@tanstack/react-query";
import { useBanks, BANKS_QUERY_KEY } from "../../../hooks/useBanks";
import bankServices from "../../../services/banks";
import queryClient from "../../../services/queryClient";
import UserModel from "../../../models/user-model";
import { ConnectBankFormType } from "../ConnectBankForm";
import { ConnectBankModel } from "../../components/CustomModal";
import { RefreshBankDataButton } from "../../components/RefreshBankDataButton";
import { BankAccountModel } from "../../../models/bank-model";
import { asNumString, getCompanyName } from "../../../utils/helpers";
import { App, Button, Card, Col, Flex, Row, Tag, Tooltip, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

dayjs.extend(relativeTime);

interface BankAccountPageProps {
  bankAccount: BankAccountModel;
  user: UserModel;
};

const BankAccountPage = (props: BankAccountPageProps) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { isLoading: banksLoading } = useBanks();
  const { lastConnection, details, bankName, _id: bank_id, isCardProvider } = props.bankAccount;
  const lastConnectionDateString = dayjs(lastConnection).fromNow() || null;
  const [isOkBtnActive, setIsOkBtnActive] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMainAccount = !!props.bankAccount.isMainAccount;
  const cardsCount = props.bankAccount?.cardsPastOrFutureDebit?.cardsBlock?.length || 0;
  const upcomingDebitsCount = props.bankAccount?.pastOrFutureDebits?.length || 0;
  const disabledMainAccountBtnTitle = isMainAccount ?
  t('bankPage.account.isMainTitle') :
  isCardProvider ?
  t('bankPage.account.cardProviderTitle') : ''

  const setMainMutation = useMutation({
    mutationFn: () => bankServices.setMainAccount(props.user._id, bank_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY, props.user._id] });
      message.success(t('bankPage.account.setAsMainSuccess', { bank: getCompanyName(bankName) }));
    },
    onError: (err: any) => message.error(err),
  });

  const editAccountDetails = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Row justify="center" className="bank-account-detail-row">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card className="bank-account-card" bordered={false}>
            {/* Header */}
            <Flex align="center" justify="space-between" className="bank-card-header">
              <Flex align="center" gap={12}>
                <div className="bank-card-icon">
                  <Typography.Text className="bank-card-initials">
                    {getCompanyName(bankName)?.[0] ?? '?'}
                  </Typography.Text>
                </div>
                <Flex vertical gap={2}>
                  <Typography.Title level={4} style={{ margin: 0 }}>{getCompanyName(bankName)}</Typography.Title>
                  {isMainAccount && <Tag color="teal" className="main-account-tag">{t('bankPage.account.mainAccount')}</Tag>}
                </Flex>
              </Flex>
              <Button
                icon={<EditOutlined />}
                disabled={banksLoading}
                onClick={editAccountDetails}
                className="bank-edit-btn"
              >
                {t('bankPage.account.edit')}
              </Button>
            </Flex>

            {/* Stats */}
            <div className="bank-stats-grid">
              <div className="bank-stat-item">
                <span className="bank-stat-label">{t('bankPage.account.balance')}</span>
                <span className="bank-stat-value">
                  ₪{asNumString(details?.balance || 0)}
                </span>
              </div>
              <div className="bank-stat-item">
                <span className="bank-stat-label">{t('bankPage.account.lastUpdated')}</span>
                <span className="bank-stat-value bank-stat-secondary">
                  {lastConnectionDateString ?? '—'}
                </span>
              </div>
              <div className="bank-stat-item">
                <span className="bank-stat-label">{t('bankPage.detail.accountNumber')}</span>
                <span className="bank-stat-value bank-stat-secondary">
                  {details?.accountNumber || t('bankPage.detail.unavailable')}
                </span>
              </div>
              <div className="bank-stat-item">
                <span className="bank-stat-label">{t('bankPage.detail.cardFeeds')}</span>
                <span className="bank-stat-value">
                  {cardsCount}
                </span>
              </div>
            </div>

            <div className="page-inline-metadata">
              <span className="page-badge">{isCardProvider ? t('bankPage.detail.creditProvider') : t('bankPage.detail.bankAccount')}</span>
              <span className="page-badge">{`${upcomingDebitsCount} ${t('bankPage.detail.futureDebitSnapshots')}`}</span>
              {isMainAccount && <span className="page-badge">{t('bankPage.detail.primaryBalanceSource')}</span>}
            </div>

            {/* Actions */}
            <Flex gap={10} className="bank-actions">
              <RefreshBankDataButton bank={props.bankAccount} />
              <Tooltip title={disabledMainAccountBtnTitle}>
                <Button
                  disabled={isMainAccount || isCardProvider}
                  loading={setMainMutation.isPending}
                  onClick={() => setMainMutation.mutate()}
                  className="bank-main-account-btn"
                >
                  {t('bankPage.account.setAsMain')}
                </Button>
              </Tooltip>
            </Flex>
          </Card>
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
          closable: true,
          cancelButtonProps: {
            onClick: () => setIsOpen(false),
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
