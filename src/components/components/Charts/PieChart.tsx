import { useState } from "react";
import { useAppSelector } from "../../../redux/store";
import {
  PieChart as Charts,
  Pie,
  ResponsiveContainer,
  Cell,
  Sector,
  Legend,
} from "recharts";
import CategoryModel from "../../../models/category-model";
import TransactionModel from "../../../models/transaction";
import {
  asNumString,
  isArrayAndNotEmpty,
  setCategoriesAndInvoicesArray,
} from "../../../utils/helpers";
import { ThemeColors } from "../../../utils/enums";

interface ChartsProps {
  categories: CategoryModel[];
  transactions: TransactionModel[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    theme,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "end" : "start";
  const textColor = theme === ThemeColors.LIGHT ? "#333" : "#FFFFFF";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
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
      {value > 0.1 && (
        <>
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
          />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill={textColor}
          >{`Price ${asNumString(value)}`}</text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
          >
            {`(Rate ${(percent * 100).toFixed(2)}%)`}
          </text>
        </>
      )}
    </g>
  );
};

export const PieChart = (props: ChartsProps) => {
  const [state, setState] = useState({ activeIndex: 0 });
  const { theme } = useAppSelector((state) => state.config.themeColor);

  let data = setCategoriesAndInvoicesArray(
    props.categories,
    props.transactions
  );
  if (!isArrayAndNotEmpty(data)) {
    data = [{ name: "No Data", value: 0.001 }];
  }

  const onPieEnter = (_: any, index: number) => {
    setState({
      activeIndex: index,
    });
  };

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <Charts>
        <Pie
          activeIndex={state.activeIndex}
          activeShape={(props: any) => renderActiveShape({ ...props, theme })}
          data={data}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          nameKey={"name"}
          onMouseEnter={onPieEnter}
        >
          {isArrayAndNotEmpty(data) &&
            data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          margin={{ top: 100 }}
          formatter={(value) => (
            <span style={{ marginRight: "10px" }}>{value}</span>
          )}
        />
      </Charts>
    </ResponsiveContainer>
  );
};
