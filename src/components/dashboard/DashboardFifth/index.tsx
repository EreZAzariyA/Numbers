import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Flex, Row, Skeleton, Tag, Typography } from "antd";
import { LuCheckCircle, LuAlertTriangle, LuXCircle, LuMinus } from "react-icons/lu";
import UserModel from "../../../models/user-model";
import transactionsServices from "../../../services/transactions";
import { ComponentResult, FinancialHealthResponse } from "../../../utils/types";
import { useAppSelector } from "../../../redux/store";

interface DashboardFifthProps {
  user: UserModel;
}

const STATUS_COLOR: Record<string, string> = {
  good: "#10b981",
  warning: "#f59e0b",
  bad: "#ef4444",
  neutral: "#6b7280",
};

const StatusIcon = ({ status }: { status: string }) => {
  const color = STATUS_COLOR[status] ?? STATUS_COLOR.neutral;
  const size = 16;
  switch (status) {
    case "good":    return <LuCheckCircle size={size} color={color} />;
    case "warning": return <LuAlertTriangle size={size} color={color} />;
    case "bad":     return <LuXCircle size={size} color={color} />;
    default:        return <LuMinus size={size} color={color} />;
  }
};

const ComponentRow = ({ label, component }: { label: string; component: ComponentResult }) => (
  <Flex align="center" gap={8} style={{ paddingBlock: 4 }}>
    <StatusIcon status={component.status} />
    <Flex vertical gap={0} style={{ flex: 1 }}>
      <Typography.Text strong style={{ fontSize: 13 }}>{label}</Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>{component.detail}</Typography.Text>
    </Flex>
  </Flex>
);

const DashboardFifth = ({ user }: DashboardFifthProps) => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.config.language);

  const { data, isLoading, isError } = useQuery<FinancialHealthResponse>({
    queryKey: ["financialHealth", user?._id, lang],
    queryFn: () => transactionsServices.fetchFinancialHealth(user._id, lang),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 10,
  });

  const statusColor = STATUS_COLOR[data?.status ?? "neutral"];

  return (
    <Card title={t("dashboard.fifth.title")}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isError ? (
        <Typography.Text type="danger">{t("dashboard.fifth.error")}</Typography.Text>
      ) : (
        <Row gutter={[20, 20]}>
          {/* Score badge */}
          <Col xs={24} sm={8} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flex vertical align="center" gap={8}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  border: `4px solid ${statusColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography.Title level={2} style={{ margin: 0, color: statusColor, lineHeight: 1 }}>
                  {data?.score}
                </Typography.Title>
                <Typography.Text style={{ fontSize: 11, color: statusColor }}>/ 100</Typography.Text>
              </div>
              <Tag color={data?.status === "good" ? "success" : data?.status === "warning" ? "warning" : "error"} style={{ textTransform: "capitalize", fontSize: 13 }}>
                {t(`dashboard.fifth.status.${data?.status}`)}
              </Tag>
            </Flex>
          </Col>

          {/* Component rows */}
          <Col xs={24} sm={16}>
            <Flex vertical gap={4}>
              <ComponentRow label={t("dashboard.fifth.components.cashFlow")} component={data!.components.cashFlow} />
              <ComponentRow label={t("dashboard.fifth.components.categoryBudgets")} component={data!.components.categoryBudgets} />
              <ComponentRow label={t("dashboard.fifth.components.savingsTrend")} component={data!.components.savingsTrend} />
              <ComponentRow label={t("dashboard.fifth.components.debtPressure")} component={data!.components.debtPressure} />
            </Flex>
          </Col>

          {/* AI insight */}
          {data?.aiInsight && (
            <Col xs={24}>
              <div className="forecast-ai-insight">
                <Typography.Paragraph style={{ margin: 0, fontSize: 13 }}>
                  {data.aiInsight}
                </Typography.Paragraph>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Card>
  );
};

export default DashboardFifth;
