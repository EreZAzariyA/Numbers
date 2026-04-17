import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ReloadOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Flex, Row, Skeleton, Tag, Typography } from "antd";
import { LuArrowDownCircle, LuArrowUpCircle, LuCalendarClock } from "react-icons/lu";
import transactionsServices from "../../services/transactions";
import { CashFlowProjectionResponse, ProjectedEvent } from "../../utils/types";
import { useAppSelector } from "../../redux/store";
import { asNumString } from "../../utils/helpers";

const RISK_COLOR: Record<string, "success" | "warning" | "error"> = {
  low: "success",
  medium: "warning",
  high: "error",
};

const EventRow = ({ event }: { event: ProjectedEvent }) => {
  const { t } = useTranslation();
  const isIncome = event.type === "income";
  const color = isIncome ? "#10b981" : "#ef4444";
  const Icon = isIncome ? LuArrowUpCircle : LuArrowDownCircle;

  return (
    <Flex
      align="center"
      gap={10}
      style={{
        padding: "8px 0",
        borderBottom: "1px solid var(--ant-color-border-secondary, #f0f0f0)",
        opacity: event.alreadyReceived ? 0.45 : 1,
      }}
    >
      <Icon size={18} color={color} />
      <Flex vertical style={{ flex: 1 }}>
        <Typography.Text style={{ fontSize: 13 }}>{event.description}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {event.expectedDate}
          {event.alreadyReceived && ` · ${t('cashFlow.alreadyRecorded')}`}
        </Typography.Text>
      </Flex>
      <Typography.Text strong style={{ color }}>
        {isIncome ? "+" : "-"}{asNumString(event.amount)}
      </Typography.Text>
    </Flex>
  );
};

const StatCard = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
  <Card size="small" style={{ textAlign: "center" }}>
    <Typography.Text type="secondary" style={{ fontSize: 12, display: "block" }}>{label}</Typography.Text>
    <Typography.Title level={4} style={{ margin: 0, color: valueColor }}>{value}</Typography.Title>
  </Card>
);

const CashFlowPage = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError, isFetching, refetch } = useQuery<CashFlowProjectionResponse>({
    queryKey: ["cashFlow", user?._id],
    queryFn: () => transactionsServices.fetchCashFlowProjection(user._id),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

  const netColor = data
    ? data.projectedMonthNet >= 0 ? "#10b981" : "#ef4444"
    : undefined;

  return (
    <Flex vertical gap={20} className="page-container cash-flow">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t("cashFlow.kicker")}</div>
            <Typography.Title level={2} className="page-title">
              {t("cashFlow.title")}
            </Typography.Title>
            <Typography.Text className="page-subtitle">{t("cashFlow.subtitle")}</Typography.Text>
          </div>
          <div className="page-toolbar">
            <Button
              type="default"
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={() => void refetch()}
            >
              {t("cashFlow.refreshBtn")}
            </Button>
            {data && (
              <Tag color={RISK_COLOR[data.riskLevel]} style={{ fontSize: 13 }}>
                {t(`cashFlow.risk.${data.riskLevel}`)}
              </Tag>
            )}
          </div>
        </div>

        {data && (
          <div className="page-stat-grid">
            <div className="page-stat-card">
              <span className="page-stat-label">{t("cashFlow.summary.riskLevel")}</span>
              <span className="page-stat-value">{t(`cashFlow.risk.${data.riskLevel}`)}</span>
              <span className="page-stat-caption">{t("cashFlow.summary.riskCaption")}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t("cashFlow.summary.expectedEvents")}</span>
              <span className="page-stat-value">{data.expectedEvents.filter(event => !event.alreadyReceived).length}</span>
              <span className="page-stat-caption">{t("cashFlow.summary.expectedEventsCaption")}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t("cashFlow.summary.projectedNet")}</span>
              <span className="page-stat-value">{`${data.projectedMonthNet >= 0 ? "+" : ""}${asNumString(data.projectedMonthNet)}`}</span>
              <span className="page-stat-caption">{t("cashFlow.summary.projectedNetCaption")}</span>
            </div>
            <div className="page-stat-card">
              <span className="page-stat-label">{t("cashFlow.summary.daysRemaining")}</span>
              <span className="page-stat-value">{data.daysRemaining}</span>
              <span className="page-stat-caption">{t("cashFlow.summary.daysRemainingCaption")}</span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : isError ? (
        <Typography.Text type="danger">{t("cashFlow.error")}</Typography.Text>
      ) : (
        <>
          <div className="page-highlight">
            <span className="page-highlight-title">{t("cashFlow.summary.outlookTitle")}</span>
            <span className="page-highlight-copy">{t("cashFlow.summary.outlookCopy")}</span>
          </div>

          {/* Stat cards row */}
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={8}>
              <StatCard
                label={t("cashFlow.incomeToDate")}
                value={asNumString(data!.incomeToDate)}
                valueColor="#10b981"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                label={t("cashFlow.expensesToDate")}
                value={asNumString(data!.expensesToDate)}
                valueColor="#ef4444"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                label={t("cashFlow.projectedNet")}
                value={(data!.projectedMonthNet >= 0 ? "+" : "") + asNumString(data!.projectedMonthNet)}
                valueColor={netColor}
              />
            </Col>
          </Row>

          {/* Balance row */}
          {data!.currentBalance !== null && (
            <Card size="small">
              <Flex justify="space-between" wrap="wrap" gap={8}>
                <Flex gap={8}>
                  <Typography.Text type="secondary">{t("cashFlow.currentBalance")}:</Typography.Text>
                  <Typography.Text strong>{asNumString(data!.currentBalance)}</Typography.Text>
                </Flex>
                {data!.projectedEndBalance !== null && (
                  <Flex gap={8}>
                    <Typography.Text type="secondary">{t("cashFlow.projectedBalance")}:</Typography.Text>
                    <Typography.Text strong style={{ color: netColor }}>
                      {asNumString(data!.projectedEndBalance)}
                    </Typography.Text>
                  </Flex>
                )}
                <Typography.Text type="secondary">
                  {data!.daysRemaining} {t("cashFlow.daysRemaining")}
                </Typography.Text>
              </Flex>
            </Card>
          )}

          {/* Expected events */}
          <Card
            title={
              <Flex align="center" gap={8}>
                <LuCalendarClock size={16} />
                {t("cashFlow.upcomingEvents")}
                <Badge count={data!.expectedEvents.filter(e => !e.alreadyReceived).length} color="#6b7280" />
              </Flex>
            }
          >
            {data!.expectedEvents.length === 0 ? (
              <Typography.Text type="secondary">{t("cashFlow.noEvents")}</Typography.Text>
            ) : (
              <Flex vertical>
                {data!.expectedEvents.map((event, i) => (
                  <EventRow key={`${event.description}-${event.expectedDate}-${i}`} event={event} />
                ))}
              </Flex>
            )}
          </Card>
        </>
      )}
    </Flex>
  );
};

export default CashFlowPage;
