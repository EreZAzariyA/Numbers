import { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from "recharts";
import CategoryModel from "../../models/category-model";
import InvoiceModel from "../../models/invoice";
import { asNumString, setCategoriesAndInvoicesArray } from "../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeColors } from "../../redux/slicers/theme-slicer";

interface ChartsProps {
  categories: CategoryModel[];
  invoices: InvoiceModel[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, theme } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const textColor = theme === ThemeColors.LIGHT ? "#333" : '#FFFFFF'

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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={textColor}>{`Price ${asNumString(value)}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Charts = (props: ChartsProps) => {
  const data = setCategoriesAndInvoicesArray(props.categories, props.invoices);
  const [state, setState] = useState({ activeIndex: 0 });
  const theme = useSelector((state: RootState) => state.theme.themeColor);

  const onPieEnter = (_: any, index: number) => {
    setState({
      activeIndex: index,
    });
  };

  return (
    <ResponsiveContainer width={'100%'} height={250}>
      <PieChart>
        <Pie
            activeIndex={state.activeIndex}
            activeShape={(props: any) => renderActiveShape({ ...props, theme })}
            data={data}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            onMouseEnter={onPieEnter}
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