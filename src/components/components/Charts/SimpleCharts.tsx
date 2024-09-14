import { useState } from "react";
import CategoryModel from "../../../models/category-model";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface SimpleChartsProps {
  categories: CategoryModel[];
  transactions: TransactionModel[];
}

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
      <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill}>
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
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
  const [state, setState] = useState({ activeIndex: 0 });
  let data = setCategoriesAndInvoicesArray(
    props.categories,
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
          layout="vertical"
          verticalAlign="middle"
          align="right"
          onClick={(_, index) => setState({ activeIndex: index })}
          formatter={(value) => (
            <span style={{ marginRight: "10px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};