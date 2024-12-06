import { useState } from "react";
import { useAppSelector } from "../../../redux/store";
import TransactionModel from "../../../models/transaction";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface SimpleChartsProps {
  transactions: TransactionModel[];
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
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {`Price ${asNumString(value)}`}
      </text>
      {(value > 0.1) && (
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill}>
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
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
  const { categories, loading } = useAppSelector((state) => state.categories);
  const [state, setState] = useState({ activeIndex: 0 });
  const screen = Grid.useBreakpoint();

  let data = setCategoriesAndInvoicesArray(
    categories,
    props.transactions
  );
  data = data.sort((a, b) => b.value - a.value);
  if (!isArrayAndNotEmpty(data)) {
    data = [{ name: "No Data", value: 0.001 }];
  }

  const onPieEnter = (_: any, index: number) => {
    setState({
      activeIndex: index,
    });
  };

  if (loading && props.loading) return <Spin />
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <PieChart>
        <Pie
          activeIndex={state.activeIndex}
          activeShape={(props: any) => renderActiveShape({ ...props })}
          data={data}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout={screen.sm ? "vertical" : "horizontal"}
          verticalAlign={screen.sm ? "middle" : "bottom"}
          align={screen.sm ? "right" : "center"}
          onClick={(_, index) => setState({ activeIndex: index })}
          formatter={(value) => (
            <span style={{ marginRight: "10px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
