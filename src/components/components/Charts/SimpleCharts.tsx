import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  asNumString,
  isArrayAndNotEmpty,
  setCategoriesAndInvoicesArray,
} from "../../../utils/helpers";
import { Grid, Spin } from "antd";
import categoriesServices from "../../../services/categories";
import { useQuery } from "@tanstack/react-query";
import CategoryModel from "../../../models/category-model";
import { MainTransaction } from "../../../services/transactions";
import { ThemeColors } from "../../../utils/enums";

const COLORS = ["#14B8A6", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981", "#F97316", "#3B82F6", "#EC4899", "#84CC16"];

interface SimpleChartsProps {
  transactions: MainTransaction[];
  loading: boolean;
};

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    isEmpty,
    theme,
    noDataLabel = "No data",
  } = props;

  const mutedColor = theme === ThemeColors.LIGHT ? "#94a3b8" : "#64748b";

  return (
    <g>
      {/* Center label: only show category name when there's real data */}
      {!isEmpty && (
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} fontSize={13} fontWeight={500}>
          {payload.name}
        </text>
      )}
      {isEmpty && (
        <text x={cx} y={cy} dy={5} textAnchor="middle" fill={mutedColor} fontSize={13} fontWeight={500}>
          {noDataLabel}
        </text>
      )}
      {!isEmpty && value > 0.1 && (
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} fontSize={13}>
          {asNumString(value)}
        </text>
      )}
      {!isEmpty && value > 0.1 && (
        <text x={cx} y={cy + 26} dy={8} textAnchor="middle" fill="#94a3b8" fontSize={11}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      )}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export const SimpleCharts = (props: SimpleChartsProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth?.user);
  const { theme } = useAppSelector((state) => state.config.themeColor);
  const fetchCategories = async () => await categoriesServices.fetchCategories(user._id);
  const { data: categories, isLoading: loading } = useQuery<CategoryModel[]>({ queryKey: ['categories', user?._id], queryFn: fetchCategories });

  const [state, setState] = useState({ activeIndex: 0 });
  const screen = Grid.useBreakpoint();

  let data = setCategoriesAndInvoicesArray(
    categories,
    props.transactions
  );
  data = data.sort((a, b) => b.value - a.value);
  const isEmpty = !isArrayAndNotEmpty(data);
  if (isEmpty) {
    data = [{ name: "", value: 0.001 }];
  }

  const emptyColor = theme === ThemeColors.LIGHT ? "#e2e8f0" : "#1e293b";

  const onPieEnter = (_: any, index: number) => {
    setState({
      activeIndex: index,
    });
  };

  if (loading && props.loading) return <Spin />
  return (
    <ResponsiveContainer width={"100%"} height={screen.xs ? 300 : 200}>
      <PieChart>
        <Pie
          activeIndex={state.activeIndex}
          activeShape={(props: any) => renderActiveShape({ ...props, isEmpty, theme, noDataLabel: t('charts.noData') })}
          data={data}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={isEmpty ? emptyColor : COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {!isEmpty && (
          <Legend
            layout={screen.sm ? "vertical" : "horizontal"}
            verticalAlign={screen.sm ? "middle" : "bottom"}
            align={screen.sm ? "right" : "center"}
            onClick={(_, index) => setState({ activeIndex: index })}
            formatter={(value) => (
              <span style={{ marginRight: "10px" }}>{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
