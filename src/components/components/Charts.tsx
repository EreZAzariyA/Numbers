import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from "recharts";
import CategoryModel from "../../models/category-model";
import InvoiceModel from "../../models/invoice";
import { setCategoriesAndInvoicesArray } from "../../utils/helpers";
import { MouseEvent, useState } from "react";

interface ChartsProps {
  categories: CategoryModel[];
  invoices: InvoiceModel[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Charts = (props: ChartsProps) => {
  const data = setCategoriesAndInvoicesArray(props.categories, props.invoices);

  return (
    <ResponsiveContainer width={'100%'} height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey={'value'}
          outerRadius={80}
          label={renderCustomizedLabel}
          labelLine={false}
          legendType="diamond"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Charts;