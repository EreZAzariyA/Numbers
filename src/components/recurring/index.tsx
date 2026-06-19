import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAppSelector } from "../../redux/store";
import transactionsServices from "../../services/transactions";
import { Frequency, RecurringGroup } from "../../utils/types";
import { asNumString, getCompanyName } from "../../utils/helpers";
import {
  Empty,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MainTransaction } from "../../services/transactions";
import SubscriptionsPanel from "./SubscriptionsPanel";

const { Title } = Typography;

const FREQUENCY_COLOR: Record<string, string> = {
  weekly: "green",
  biweekly: "cyan",
  monthly: "blue",
  bimonthly: "geekblue",
  quarterly: "purple",
  semiannual: "magenta",
  annual: "volcano",
  irregular: "orange",
  unknown: "default",
};

const KIND_COLOR: Record<string, string> = {
  expense: "red",
  income: "green",
};

const FREQUENCY_ORDER: Frequency[] = [
  "weekly",
  "biweekly",
  "monthly",
  "bimonthly",
  "quarterly",
  "semiannual",
  "annual",
  "irregular",
  "unknown",
];

const formatRecurringDate = (date?: string | null, processedDate?: string | null) => {
  const value = date || processedDate;
  if (!value) {
    return "—";
  }

  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "—";
};

const RecurringTransactions = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useQuery<RecurringGroup[]>({
    queryKey: ["recurring", user?._id],
    queryFn: () => transactionsServices.fetchRecurringTransactions(user._id),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

  const frequencyFilters = Array.from(new Set((data ?? []).map((group) => group.frequency)))
    .sort((a, b) => FREQUENCY_ORDER.indexOf(a) - FREQUENCY_ORDER.indexOf(b))
    .map((frequency) => ({
      text: t(`recurring.frequency.${frequency}`, { defaultValue: frequency }),
      value: frequency,
    }));

  const columns: ColumnsType<RecurringGroup> = [
    {
      title: t("recurring.columns.description"),
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: t("recurring.columns.flow"),
      dataIndex: "kind",
      key: "kind",
      render: (value: string) => (
        <Tag color={KIND_COLOR[value] ?? "default"}>{t(`recurring.kind.${value}`)}</Tag>
      ),
      filters: [
        { text: t("recurring.kind.expense"), value: "expense" },
        { text: t("recurring.kind.income"), value: "income" },
      ],
      onFilter: (value, record) => record.kind === value,
    },
    {
      title: t("recurring.columns.avgAmount"),
      dataIndex: "amount",
      key: "amount",
      render: (v, record) => `${record.kind === "expense" ? "-" : "+"}₪${asNumString(v)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: t("recurring.columns.frequency"),
      dataIndex: "frequency",
      key: "frequency",
      render: (value: Frequency) => (
        <Tag color={FREQUENCY_COLOR[value] ?? "default"}>
          {t(`recurring.frequency.${value}`, { defaultValue: value })}
        </Tag>
      ),
      filters: frequencyFilters,
      onFilter: (value, record) => record.frequency === value,
    },
    {
      title: t("recurring.columns.occurrences"),
      dataIndex: "occurrences",
      key: "occurrences",
      sorter: (a, b) => a.occurrences - b.occurrences,
    },
    {
      title: t("recurring.columns.nextExpected"),
      dataIndex: "nextExpected",
      key: "nextExpected",
      render: (v) => v ?? "—",
    },
    {
      title: t("recurring.columns.totalSpent"),
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (v) => `₪${asNumString(v)}`,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      defaultSortOrder: "descend",
    },
  ];

  const innerColumns: ColumnsType<MainTransaction> = [
    {
      title: t("transactions.table.header.date"),
      dataIndex: "date",
      key: "date",
      render: (value, record: any) => formatRecurringDate(value, record?.processedDate),
    },
    {
      title: t("transactions.table.header.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (v) => `₪${asNumString(v)}`,
    },
    { title: t("transactions.table.header.description"), dataIndex: "description", key: "description" },
    {
      title: t("transactions.table.header.company"),
      dataIndex: "companyId",
      key: "companyId",
      render: (v) => getCompanyName(v),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description={t("recurring.error")} />
      </div>
    );
  }

  const monthlyTotal = data
    .filter((group) => group.frequency === "monthly" && group.kind === "expense")
    .reduce((sum, group) => sum + Math.abs(group.amount), 0);
  const monthlyIncome = data
    .filter((group) => group.frequency === "monthly" && group.kind === "income")
    .reduce((sum, group) => sum + Math.abs(group.amount), 0);
  const nextExpected = [...data]
    .filter((group) => !!group.nextExpected)
    .sort((a, b) => dayjs(a.nextExpected).valueOf() - dayjs(b.nextExpected).valueOf())[0];

  return (
    <div className="page-container recurring">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t("recurring.kicker")}</div>
            <Title level={2} className="page-title">{t("recurring.title")}</Title>
            <Typography.Text className="page-subtitle">{t("recurring.subtitle")}</Typography.Text>
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t("recurring.summary.groups")}</span>
            <span className="page-stat-value">{data.length}</span>
            <span className="page-stat-caption">{t("recurring.summary.groupsCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("recurring.summary.monthlyTotal")}</span>
            <span className="page-stat-value">₪{asNumString(monthlyTotal)}</span>
            <span className="page-stat-caption">{t("recurring.summary.monthlyTotalCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("recurring.summary.monthlyIncome")}</span>
            <span className="page-stat-value">₪{asNumString(monthlyIncome)}</span>
            <span className="page-stat-caption">{t("recurring.summary.monthlyIncomeCaption")}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t("recurring.summary.nextExpected")}</span>
            <span className="page-stat-value">{nextExpected?.nextExpected || "—"}</span>
            <span className="page-stat-caption">{t("recurring.summary.nextExpectedCaption")}</span>
          </div>
        </div>
      </div>

      <div className="page-shell">
        <SubscriptionsPanel />
      </div>

      {data.length === 0 ? (
        <div className="page-panel">
          <Empty description={t("recurring.empty")} />
        </div>
      ) : (
        <div className="page-panel">
          <div className="page-panel-header">
            <div>
              <div className="page-panel-title">{t("recurring.panel.title")}</div>
              <div className="page-panel-subtitle">{t("recurring.panel.subtitle")}</div>
            </div>
          </div>
          <Table<RecurringGroup>
            dataSource={data}
            columns={columns}
            rowKey={(record) => `${record.kind}:${record.normalizedDescription}:${record.amount}`}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (record) => (
                <Table<MainTransaction>
                  dataSource={record.transactions as unknown as MainTransaction[]}
                  columns={innerColumns}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions;
