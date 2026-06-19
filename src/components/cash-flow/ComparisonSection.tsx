import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, Flex, Skeleton, Tag, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/store";
import transactionsServices, { CategoryChange } from "../../services/transactions";
import { asNumString } from "../../utils/helpers";

const DeltaTag = ({ pct }: { pct: number | null }) => {
  if (pct === null) return null;
  const up = pct >= 0;
  return (
    <Tag color={up ? "red" : "green"}>
      {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(pct)}%
    </Tag>
  );
};

const ChangeRow = ({ change }: { change: CategoryChange }) => {
  const up = change.delta >= 0;
  const color = up ? "#ef4444" : "#10b981";
  return (
    <Flex align="center" justify="space-between" style={{ padding: "6px 0" }}>
      <Typography.Text style={{ fontSize: 13 }}>{change.category}</Typography.Text>
      <Typography.Text strong style={{ color }}>
        {up ? "+" : "-"}{asNumString(Math.abs(change.delta))}
      </Typography.Text>
    </Flex>
  );
};

const ComparisonSection = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useQuery({
    queryKey: ["spending-comparison", user?._id],
    queryFn: () => transactionsServices.fetchSpendingComparison(user?._id as string),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <Card style={{ marginTop: 16 }}><Skeleton active /></Card>;
  }

  if (!data) return null;

  return (
    <Card title={t("comparison.title")} style={{ marginTop: 16 }}>
      <Flex align="center" gap={12} wrap="wrap" style={{ marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {asNumString(data.current.total)}
        </Typography.Title>
        <DeltaTag pct={data.totalDeltaPct} />
        <Typography.Text type="secondary">
          {t("comparison.vsLastMonth", { amount: asNumString(data.previous.total) })}
        </Typography.Text>
      </Flex>

      {data.topCategoryChanges.length > 0 && (
        <>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t("comparison.topChanges")}
          </Typography.Text>
          {data.topCategoryChanges.map((change) => (
            <ChangeRow key={change.category} change={change} />
          ))}
        </>
      )}
    </Card>
  );
};

export default ComparisonSection;
