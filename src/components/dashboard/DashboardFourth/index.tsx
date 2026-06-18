import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Flex, Row, Skeleton, Typography } from "antd";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuTrendingUp, LuTrendingDown, LuMinus } from "react-icons/lu";
import UserModel from "../../../models/user-model";
import transactionsServices from "../../../services/transactions";
import { ForecastResponse } from "../../../utils/types";
import { asNumString } from "../../../utils/helpers";
import { useAppSelector } from "../../../redux/store";

interface DashboardFourthProps {
  user: UserModel;
}

const DashboardFourth = ({ user }: DashboardFourthProps) => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.config.language);

  const { data, isLoading, isError } = useQuery<ForecastResponse>({
    queryKey: ["forecast", user?._id, lang],
    queryFn: () => transactionsServices.fetchForecast(user._id, lang),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 10,
  });

  const chartData = [
    ...(data?.historicalMonths ?? []).map((m) => ({
      name: m.month,
      amount: m.amount,
      forecastAmount: null as number | null,
    })),
    {
      name: t("dashboard.fourth.forecastLabel"),
      amount: null as number | null,
      forecastAmount: data?.forecastAmount ?? 0,
    },
  ];

  const TrendIcon = () => {
    switch (data?.trend) {
      case "up":
        return <LuTrendingUp size={20} color="#ef4444" />;
      case "down":
        return <LuTrendingDown size={20} color="#10b981" />;
      default:
        return <LuMinus size={20} color="#6b7280" />;
    }
  };

  return (
    <Card title={t("dashboard.fourth.title")} className="dashboard-fourth">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isError ? (
        <Typography.Text type="danger">{t("dashboard.fourth.error")}</Typography.Text>
      ) : (
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={10}>
            <Flex vertical gap={16}>
              <Flex vertical gap={4}>
                <Typography.Text type="secondary">
                  {t("dashboard.fourth.actualSpend")}
                </Typography.Text>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  {asNumString(data?.currentMonthSpend)}
                </Typography.Title>
              </Flex>

              <Flex vertical gap={4}>
                <Typography.Text type="secondary">
                  {t("dashboard.fourth.projectedSpend")}
                </Typography.Text>
                <Flex align="center" gap={8}>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {asNumString(data?.forecastAmount)}
                  </Typography.Title>
                  <TrendIcon />
                </Flex>
              </Flex>

              <Flex vertical gap={4}>
                <Typography.Text type="secondary">
                  {t("dashboard.fourth.monthlyAvg")}: {asNumString(data?.averageMonthlySpend)}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {t("dashboard.fourth.daysRemaining")}: {data?.daysRemaining}
                </Typography.Text>
              </Flex>

              {data?.aiInsight && (
                <div className="forecast-ai-insight">
                  <Typography.Paragraph style={{ margin: 0, fontSize: 13 }}>
                    {data.aiInsight}
                  </Typography.Paragraph>
                </div>
              )}
            </Flex>
          </Col>

          <Col xs={24} lg={14}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => asNumString(v)} width={70} />
                <Tooltip formatter={(v: number) => asNumString(v)} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0d9488"
                  fill="#0d9488"
                  fillOpacity={0.15}
                  connectNulls={false}
                />
                <Bar dataKey="forecastAmount" fill="#f97316" radius={4} />
              </ComposedChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default DashboardFourth;
