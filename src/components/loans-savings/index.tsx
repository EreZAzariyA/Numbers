import { useTranslation } from "react-i18next";
import { useBanks } from "../../hooks/useBanks";
import { asNumString, getCompanyName } from "../../utils/helpers";
import { LoanType } from "../../utils/types";
import {
  Card,
  Col,
  Descriptions,
  Empty,
  Progress,
  Row,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const LoansSavingsPage = () => {
  const { t } = useTranslation();
  const { data: account } = useBanks();
  const banks = account?.banks ?? [];

  const totalSavings = banks.reduce(
    (sum, b) => sum + (b.savings?.totalDepositsCurrentValue ?? 0),
    0
  );
  const totalLoanBalance = banks.reduce(
    (sum, b) => sum + (b.loans?.summary?.totalBalance ?? 0),
    0
  );
  const nextMonthPayments = banks.reduce(
    (sum, b) => sum + (b.loans?.summary?.currentMonthTotalPayment ?? 0),
    0
  );

  const loanColumns: ColumnsType<LoanType> = [
    { title: t("loansSavings.loans.columns.name"), dataIndex: "loanName", key: "loanName" },
    {
      title: t("loansSavings.loans.columns.amount"),
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (v) => `₪${asNumString(v)}`,
    },
    {
      title: t("loansSavings.loans.columns.balance"),
      dataIndex: "loanBalance",
      key: "loanBalance",
      render: (v) => `₪${asNumString(v)}`,
    },
    {
      title: t("loansSavings.loans.columns.nextPayment"),
      dataIndex: "nextPayment",
      key: "nextPayment",
      render: (v) => `₪${asNumString(v)}`,
    },
    {
      title: t("loansSavings.loans.columns.finishDate"),
      dataIndex: "finishDate",
      key: "finishDate",
    },
    {
      title: t("loansSavings.loans.columns.interest"),
      dataIndex: "totalInterestRate",
      key: "totalInterestRate",
      render: (v) => `${v}%`,
    },
    {
      title: t("loansSavings.loans.columns.repayment"),
      key: "repayment",
      render: (_, record) => {
        const made = Number(record.numOfPaymentsMade) || 0;
        const total = Number(record.numOfPayments) || 1;
        const percent = Math.round((made / total) * 100);
        return <Progress percent={percent} size="small" style={{ minWidth: 120 }} />;
      },
    },
  ];

  const banksWithSavings = banks.filter((b) => b.savings);
  const banksWithLoans = banks.filter((b) => (b.loans?.loans?.length ?? 0) > 0);
  const totalLoanAccounts = banksWithLoans.reduce((sum, bank) => sum + (bank.loans?.loans?.length ?? 0), 0);

  return (
    <div className="page-container loans-savings">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t("loansSavings.kicker")}</div>
            <Title level={2} className="page-title">{t("loansSavings.title")}</Title>
            <Typography.Text className="page-subtitle">{t("loansSavings.subtitle")}</Typography.Text>
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t("loansSavings.summary.totalSavings")}</span>
            <span className="page-stat-value">₪{asNumString(totalSavings)}</span>
            <span className="page-stat-caption">{t("loansSavings.summary.totalSavingsCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("loansSavings.summary.totalLoanBalance")}</span>
            <span className="page-stat-value">₪{asNumString(totalLoanBalance)}</span>
            <span className="page-stat-caption">{t("loansSavings.summary.totalLoanBalanceCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("loansSavings.summary.nextMonthPayments")}</span>
            <span className="page-stat-value">₪{asNumString(nextMonthPayments)}</span>
            <span className="page-stat-caption">{t("loansSavings.summary.nextMonthPaymentsCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("loansSavings.summary.loanAccounts")}</span>
            <span className="page-stat-value">{totalLoanAccounts}</span>
            <span className="page-stat-caption">{t("loansSavings.summary.loanAccountsCaption")}</span>
          </div>
        </div>
      </div>

      <div className="page-panel">
        <div className="page-panel-header">
          <div>
            <div className="page-panel-title">{t("loansSavings.savings.title")}</div>
            <div className="page-panel-subtitle">{t("loansSavings.savings.subtitle")}</div>
          </div>
        </div>

        {banksWithSavings.length === 0 ? (
          <Empty description={t("loansSavings.savings.empty")} />
        ) : (
          <Row gutter={[16, 16]}>
            {banksWithSavings.map((bank) => (
              <Col xs={24} sm={12} lg={8} key={bank._id}>
                <Card title={getCompanyName(bank.bankName)}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label={t("loansSavings.savings.currentValue")}>
                      ₪{asNumString(bank.savings.totalDepositsCurrentValue)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("loansSavings.savings.currency")}>
                      {bank.savings.currencyCode}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("loansSavings.savings.date")}>
                      {bank.savings.businessDate}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <div className="page-panel">
        <div className="page-panel-header">
          <div>
            <div className="page-panel-title">{t("loansSavings.loans.title")}</div>
            <div className="page-panel-subtitle">{t("loansSavings.loans.subtitle")}</div>
          </div>
        </div>

        {banksWithLoans.length === 0 ? (
          <Empty description={t("loansSavings.loans.empty")} />
        ) : (
          banksWithLoans.map((bank) => (
            <Card
              key={bank._id}
              title={getCompanyName(bank.bankName)}
            >
              <Table<LoanType>
                dataSource={bank.loans.loans}
                columns={loanColumns}
                rowKey="loanAccount"
                pagination={false}
                scroll={{ x: true }}
                expandable={{
                  expandedRowRender: (record) => (
                    <Descriptions size="small" column={2}>
                      <Descriptions.Item label={t("loansSavings.loans.detail.purpose")}>
                        {record.loanPurpose || "—"}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("loansSavings.loans.detail.established")}>
                        {record.establishmentDate}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("loansSavings.loans.detail.prepaymentFee")}>
                        ₪{asNumString(record.prepaymentPenaltyFee)}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("loansSavings.loans.detail.paymentsRemaining")}>
                        {record.numOfPaymentsRemained}
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                }}
              />
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LoansSavingsPage;
