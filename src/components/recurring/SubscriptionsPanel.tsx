import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Card, Col, Row, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/store";
import transactionsServices, { SubscriptionSummary } from "../../services/transactions";
import { asNumString } from "../../utils/helpers";

const PRICE_INCREASE_THRESHOLD = 10;

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Card size="small">
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{label}</Typography.Text>
    <Typography.Title level={4} style={{ margin: 0 }}>{value}</Typography.Title>
  </Card>
);

const SubscriptionsPanel = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions", user?._id],
    queryFn: () => transactionsServices.fetchSubscriptions(user?._id as string),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

  const columns: ColumnsType<SubscriptionSummary> = [
    {
      title: t("subscriptions.service"),
      key: "name",
      render: (_, row) => <Typography.Text strong>{row.name}</Typography.Text>,
    },
    {
      title: t("subscriptions.amount"),
      key: "amount",
      render: (_, row) => {
        const increased = row.priceChangePct !== null && row.priceChangePct >= PRICE_INCREASE_THRESHOLD;
        const decreased = row.priceChangePct !== null && row.priceChangePct <= -PRICE_INCREASE_THRESHOLD;
        return (
          <span>
            {asNumString(row.currentAmount)}
            {increased && (
              <Tag color="red" style={{ marginInlineStart: 8 }}>
                <ArrowUpOutlined /> {row.priceChangePct}%
              </Tag>
            )}
            {decreased && (
              <Tag color="green" style={{ marginInlineStart: 8 }}>
                <ArrowDownOutlined /> {Math.abs(row.priceChangePct as number)}%
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: t("subscriptions.frequency"),
      dataIndex: "frequency",
      key: "frequency",
      render: (frequency: string) => <Tag>{t(`recurring.frequency.${frequency}`, frequency)}</Tag>,
    },
    {
      title: t("subscriptions.monthlyEquivalent"),
      key: "monthlyEquivalent",
      render: (_, row) => asNumString(row.monthlyEquivalent),
    },
    {
      title: t("subscriptions.lastCharge"),
      key: "lastSeen",
      render: (_, row) => (row.lastSeen ? dayjs(row.lastSeen).format("DD/MM/YYYY") : "—"),
    },
    {
      title: t("subscriptions.status"),
      key: "status",
      render: (_, row) =>
        row.isStale
          ? <Tag color="orange">{t("subscriptions.stale")}</Tag>
          : <Tag color="blue">{t("subscriptions.active")}</Tag>,
    },
  ];

  if (isLoading) {
    return <Card style={{ marginBottom: 16 }}><Skeleton active /></Card>;
  }

  if (!data || data.subscriptions.length === 0) {
    return null;
  }

  return (
    <Card title={t("subscriptions.title")} style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}><Stat label={t("subscriptions.monthlyTotal")} value={asNumString(data.monthlyTotal)} /></Col>
        <Col xs={12} md={6}><Stat label={t("subscriptions.count")} value={data.subscriptions.length} /></Col>
        <Col xs={12} md={6}><Stat label={t("subscriptions.priceIncreases")} value={data.priceIncreaseCount} /></Col>
        <Col xs={12} md={6}><Stat label={t("subscriptions.staleCount")} value={data.staleCount} /></Col>
      </Row>
      <Table<SubscriptionSummary>
        rowKey="patternId"
        dataSource={data.subscriptions}
        columns={columns}
        size="small"
        pagination={false}
      />
    </Card>
  );
};

export default SubscriptionsPanel;
